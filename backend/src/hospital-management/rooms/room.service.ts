import { prisma } from "../../database/prismaClient";

/* ================= GET ROOM TYPES ================= */

export const getRoomTypes = async (hospitalId: string) => {
  return prisma.roomType.findMany({
    where: { hospitalId },
  });
};

/* ================= CREATE ROOM TYPE ================= */

export const createRoomType = async (
  hospitalId: string,
  name: string,
  totalBeds: number,
  pricePerNight: number,
  capacityThreshold?: number
) => {
  if (!hospitalId) {
    throw new Error("hospitalId is required");
  }

  if (!name || name.trim().length === 0) {
    throw new Error("Room name is required");
  }

  if (totalBeds <= 0) {
    throw new Error("totalBeds must be greater than 0");
  }

  const threshold = capacityThreshold ?? 0;

  if (threshold < 0) {
    throw new Error("capacityThreshold cannot be negative");
  }

  if (threshold > totalBeds) {
    throw new Error("capacityThreshold cannot exceed totalBeds");
  }

  return prisma.roomType.create({
    data: {
      hospitalId,
      name,
      totalBeds,
      occupiedBeds: 0,
      pricePerNight,
      capacityThreshold: threshold,
    },
  });
};