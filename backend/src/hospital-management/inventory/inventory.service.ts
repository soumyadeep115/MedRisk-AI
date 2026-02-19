import { prisma } from "../../database/prismaClient";
import { eventBus } from "../../orchestrator/eventBus";
import { runEquipmentRiskAgent } from "../../agents/equipment.agent";
import { v4 as uuidv4 } from "uuid";

/* ================= CREATE INVENTORY ITEM ================= */

export const createInventoryItem = async (
  hospitalId: string,
  name: string,
  category: "MEDICINE" | "SUPPLY",
  unitCost: number,
  quantity: number,
  threshold?: number
) => {
  return prisma.inventoryItem.create({
    data: {
      hospitalId,
      name,
      category,
      unitCost,
      quantity,
      threshold,
    },
  });
};

/* ================= ASSIGN ITEM TO PATIENT ================= */

export const assignInventoryToPatient = async (
  patientId: string,
  inventoryId: string,
  quantityUsed: number
) => {
  const inventory = await prisma.inventoryItem.findUnique({
    where: { id: inventoryId },
  });

  if (!inventory) throw new Error("Inventory item not found");

  if (inventory.quantity < quantityUsed) {
    throw new Error("Not enough inventory quantity");
  }

  const newQuantity = inventory.quantity - quantityUsed;

  // Deduct quantity
  await prisma.inventoryItem.update({
    where: { id: inventoryId },
    data: { quantity: newQuantity },
  });

  // Link to patient
  await prisma.patientInventory.create({
    data: {
      patientId,
      inventoryId,
      quantityUsed,
    },
  });

  /* ===== Threshold Check ===== */
  if (
    inventory.threshold !== null &&
    newQuantity <= inventory.threshold
  ) {
    const message = `Inventory low: ${inventory.name} has ${newQuantity} units left.`;

    // Create DB alert
    await prisma.alert.create({
      data: {
        hospitalId: inventory.hospitalId,
        type: "INVENTORY_LOW",
        message,
      },
    });

    // Emit event
    eventBus.emit("INVENTORY_ALERT", {
      hospital_id: inventory.hospitalId,
      item_name: inventory.name,
      remaining: newQuantity,
      threshold: inventory.threshold,
    });

    // Auto-trigger Equipment Agent
    runEquipmentRiskAgent({
  hospital_id: inventory.hospitalId,
  inventory_shortage: true,
});
  }

  return { success: true };
};

/* ================= GET INVENTORY BY HOSPITAL ================= */

export const getInventoryByHospital = async (
  hospitalId: string
) => {
  return prisma.inventoryItem.findMany({
    where: { 
      hospitalId,
      isDeleted: false   // 👈 ADD THIS
    },
    orderBy: { name: "asc" },
  });
};
/* ================= UPDATE INVENTORY QUANTITY ================= */

export const updateInventoryQuantity = async (
  id: string,
  quantity: number
) => {
  return prisma.inventoryItem.update({
    where: { id },
    data: { quantity },
  });
};

/* ================= SOFT DELETE INVENTORY ITEM ================= */

export const deleteInventoryItem = async (id: string) => {
  return prisma.inventoryItem.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};