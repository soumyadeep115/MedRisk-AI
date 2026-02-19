import { prisma } from "../../database/prismaClient";

export const getRoomTypes = async (hospitalId: string) => {
  return prisma.roomType.findMany({
    where: { hospitalId },
  });
};

export const createRoomType = async (
  hospitalId: string,
  name: string,
  totalBeds: number,
  pricePerNight: number
) => {
  return prisma.roomType.create({
    data: {
      hospitalId,
      name,
      totalBeds,
      occupiedBeds: 0,
      pricePerNight,
    },
  });
};