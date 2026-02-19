import { Router } from "express";
import { createRoomType, getRoomTypes } from "./room.service";
import { prisma } from "../../database/prismaClient";

const router = Router();

// Create new room type
router.post("/", async (req, res) => {
  try {
    const { hospitalId, name, totalBeds, pricePerNight } = req.body;

    const room = await createRoomType(
      hospitalId,
      name,
      totalBeds,
      pricePerNight
    );

    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create room type" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.roomType.delete({
      where: { id },
    });

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete room" });
  }
});

// Get all room types for hospital
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