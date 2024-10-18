/*
  Warnings:

  - You are about to drop the column `email` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `redFlagValue` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "email",
DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "redFlagValue";
