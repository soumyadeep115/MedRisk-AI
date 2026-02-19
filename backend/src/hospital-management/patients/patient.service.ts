import { prisma } from "../../database/prismaClient";
import { eventBus } from "../../orchestrator/eventBus";

/* ================= CREATE PATIENT ================= */

export const createPatient = async (
  hospitalId: string,
  name: string,
  age: number,
  gender: string
) => {
  return prisma.patient.create({
    data: {
      hospitalId,
      name,
      age,
      gender,
      discharged: false,
    },
  });
};

/* ================= ADMIT PATIENT (SAFE + ATOMIC) ================= */

export const admitPatient = async (
  patientId: string,
  roomTypeId: string
) => {
  const result = await prisma.$transaction(async (tx) => {
    console.log("ADMIT EXECUTED");

    const patient = await tx.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) throw new Error("Patient not found");
    if (!patient.discharged && patient.roomTypeId)
      throw new Error("Patient already admitted");

    const updated = await tx.$executeRaw`
      UPDATE "RoomType"
      SET "occupiedBeds" = "occupiedBeds" + 1
      WHERE id = ${roomTypeId}
      AND "occupiedBeds" < "totalBeds"
    `;

    if (updated === 0) {
      const error: any = new Error("No beds available");
      error.code = "NO_BEDS";
      throw error;
    }

    const room = await tx.roomType.findUnique({
      where: { id: roomTypeId },
    });

    if (!room) throw new Error("Room not found");

    await tx.patient.update({
      where: { id: patientId },
      data: {
        roomTypeId,
        admittedAt: new Date(),
        discharged: false,
        dischargedAt: null,
      },
    });

    return {
      hospitalId: room.hospitalId,
      message: "Patient admitted successfully",
    };
  });

  await emitCapacityUpdate(result.hospitalId);

  return { message: result.message };
};

/* ================= DISCHARGE PATIENT (SAFE + ATOMIC) ================= */

export const dischargePatient = async (patientId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const patient = await tx.patient.findUnique({
      where: { id: patientId },
      include: {
        roomType: true,
        inventoryLinks: {
          include: {
            inventory: true,
          },
        },
      },
    });

    if (!patient) throw new Error("Patient not found");
    if (patient.discharged) throw new Error("Patient already discharged");
    if (!patient.roomType) throw new Error("Patient not admitted to any room");

    const now = new Date();
    const admittedAt = patient.admittedAt ?? now;

    /* ---------- Calculate Stay Duration ---------- */
    const diffMs = now.getTime() - admittedAt.getTime();
    const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    /* ---------- Room Cost ---------- */
    const roomCost = diffDays * patient.roomType.pricePerNight;

    /* ---------- Inventory Cost ---------- */
    let medicineCost = 0;
    let supplyCost = 0;

    const inventoryBreakdown = patient.inventoryLinks.map((link: any) => {
      const itemTotal = link.quantityUsed * link.inventory.unitCost;

      if (link.inventory.category === "MEDICINE") {
        medicineCost += itemTotal;
      } else {
        supplyCost += itemTotal;
      }

      return {
        itemName: link.inventory.name,
        category: link.inventory.category,
        quantityUsed: link.quantityUsed,
        unitCost: link.inventory.unitCost,
        total: itemTotal,
      };
    });

    const miscCost = patient.miscellaneousCost ?? 0;
    const totalCost = roomCost + medicineCost + supplyCost + miscCost;
    await tx.billing.create({
      data: {
        patientId: patient.id,
        hospitalId: patient.hospitalId,
        stayDays: diffDays,
        roomCost,
        medicineCost,
        supplyCost,
        miscCost,
        totalCost,
        breakdown: {
          roomCost,
          medicineCost,
          supplyCost,
          miscCost,
          inventoryDetails: inventoryBreakdown,
        },
      },
    });

    /* --------- SAFE BED DECREMENT --------- */
    if (patient.roomType.occupiedBeds <= 0) {
      throw new Error("Invalid bed state");
    }

    await tx.roomType.update({
      where: { id: patient.roomTypeId! },
      data: {
        occupiedBeds: {
          decrement: 1,
        },
      },
    });

    await tx.patient.update({
      where: { id: patientId },
      data: {
        discharged: true,
        dischargedAt: now,
        roomTypeId: null,
      },
    });

    /* ================= UPDATED BILLING RETURN ================= */

    return {
      hospitalId: patient.hospitalId,
      patientId: patient.id,
      patientName: patient.name,
      stayDays: diffDays,

      billingSummary: {
        bedCharges: {
          pricePerNight: patient.roomType.pricePerNight,
          stayDays: diffDays,
          total: roomCost,
        },

        inventoryCharges: {
          items: inventoryBreakdown,
          totalMedicineCost: medicineCost,
          totalSupplyCost: supplyCost,
          totalInventoryCost: medicineCost + supplyCost,
        },

        miscellaneousCharges: miscCost,

        grandTotal: totalCost,
      },

      dischargedAt: now,
    };
  });

  await emitCapacityUpdate(result.hospitalId);

  return result;
};

/* ================= GET ALL PATIENTS ================= */

export const getAllPatients = async () => {
  return prisma.patient.findMany({
    include: {
      roomType: true,
      inventoryLinks: {
        include: {
          inventory: true,
        },
      },
    },
    orderBy: {
      admittedAt: "desc",
    },
  });
};

/* ================= SCHEDULE ADMISSION ================= */

export const scheduleAdmission = async (
  patientId: string,
  roomTypeId: string,
  hospitalId: string
) => {
  const existing = await prisma.admissionRequest.findFirst({
    where: {
      patientId,
      status: "PENDING",
    },
  });

  if (existing) {
    throw new Error("Admission already scheduled");
  }

  return prisma.admissionRequest.create({
    data: {
      hospitalId,
      patientId,
      roomTypeId,
      status: "PENDING",
    },
  });
};

/* ================= CAPACITY EMITTER (PER ROOM TYPE) ================= */

const emitCapacityUpdate = async (hospitalId: string) => {
  const roomTypes = await prisma.roomType.findMany({
    where: { hospitalId },
  });

  for (const room of roomTypes) {
    eventBus.emit("CAPACITY_UPDATE", {
      hospital_id: hospitalId,
      total_beds: room.totalBeds,
      occupied_beds: room.occupiedBeds,
      capacity_threshold: room.capacityThreshold ?? 0,
    });
  }
};

/* ================= CANCEL ADMISSION ================= */

export const cancelAdmission = async (patientId: string) => {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) throw new Error("Patient not found");
  if (patient.roomTypeId) throw new Error("Cannot cancel admitted patient");
  if (patient.discharged) throw new Error("Patient already discharged");

  return prisma.patient.update({
    where: { id: patientId },
    data: {
      discharged: true,
      dischargedAt: new Date(),
    },
  });
};