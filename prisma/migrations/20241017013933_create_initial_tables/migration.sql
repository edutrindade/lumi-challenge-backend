-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "installationNumber" TEXT NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "referenceYear" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "class" TEXT,
    "energyAmountKwh" DOUBLE PRECISION NOT NULL,
    "energyValue" DOUBLE PRECISION NOT NULL,
    "energySCEEEKwh" DOUBLE PRECISION NOT NULL,
    "energySCEEValue" DOUBLE PRECISION NOT NULL,
    "compensatedGDIKwh" DOUBLE PRECISION NOT NULL,
    "compensatedGDIValue" DOUBLE PRECISION NOT NULL,
    "publicLightingValue" DOUBLE PRECISION NOT NULL,
    "lastReadingDate" TIMESTAMP(3),
    "readingDate" TIMESTAMP(3) NOT NULL,
    "nextReadingDate" TIMESTAMP(3),
    "daysToRead" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "addressId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_cpfCnpj_key" ON "Client"("cpfCnpj");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
