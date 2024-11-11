-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'TREASURER');

-- CreateTable
CREATE TABLE "Office" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "totalLot" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "bankBalance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bankAccount" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "officeId" INTEGER NOT NULL,

    CONSTRAINT "bankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoOwnership" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OWNER',
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lotNumber" INTEGER NOT NULL,
    "bankBalance" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "officeId" INTEGER,

    CONSTRAINT "CoOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "utility" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "range" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "contractId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Office_email_key" ON "Office"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bankAccount_officeId_key" ON "bankAccount"("officeId");

-- CreateIndex
CREATE UNIQUE INDEX "CoOwnership_email_key" ON "CoOwnership"("email");

-- AddForeignKey
ALTER TABLE "bankAccount" ADD CONSTRAINT "bankAccount_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoOwnership" ADD CONSTRAINT "CoOwnership_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
