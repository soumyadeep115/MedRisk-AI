import { Router } from "express";
import { createRoomType, getRoomTypes } from "./room.service";
import { prisma } from "../../database/prismaClient";

const router = Router();

/* ================= CREATE ROOM TYPE ================= */

router.post("/", async (req, res) => {
  try {
    const {
      hospitalId,
      name,
      totalBeds,
      pricePerNight,
      capacityThreshold
    } = req.body;

    if (!hospitalId || !name || totalBeds === undefined || pricePerNight === undefined) {
      return res.status(400).json({
        message: "hospitalId, name, totalBeds, and pricePerNight are required"
      });
    }

    const room = await createRoomType(
      hospitalId,
      name,
      Number(totalBeds),
      Number(pricePerNight),
      capacityThreshold !== undefined
        ? Number(capacityThreshold)
        : undefined
    );

    res.status(201).json(room);

  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || "Failed to create room type"
    });
  }
});

/* ================= DELETE ROOM ================= */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.patient.updateMany({
      where: { roomTypeId: id },
      data: { roomTypeId: null },
    });

    await prisma.admissionRequest.deleteMany({
      where: { roomTypeId: id },
    });

    await prisma.roomType.delete({
      where: { id },
    });

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete room" });
  }
});

/* ================= GET ROOMS ================= */

router.get("/:hospitalId", async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const rooms = await getRoomTypes(hospitalId);

    res.json(rooms);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch room types" });
  }
});

export default router;