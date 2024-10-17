/*
  Warnings:

  - A unique constraint covering the columns `[clientNumber]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "fineForDelay" DOUBLE PRECISION,
ADD COLUMN     "redFlagValue" DOUBLE PRECISION,
ALTER COLUMN "energySCEEEKwh" DROP NOT NULL,
ALTER COLUMN "energySCEEValue" DROP NOT NULL,
ALTER COLUMN "compensatedGDIKwh" DROP NOT NULL,
ALTER COLUMN "compensatedGDIValue" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_clientNumber_key" ON "Client"("clientNumber");
