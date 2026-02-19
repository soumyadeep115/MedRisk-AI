-- CreateTable
CREATE TABLE "Billing" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "stayDays" INTEGER NOT NULL,
    "roomCost" DOUBLE PRECISION NOT NULL,
    "medicineCost" DOUBLE PRECISION NOT NULL,
    "supplyCost" DOUBLE PRECISION NOT NULL,
    "miscCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "breakdown" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
