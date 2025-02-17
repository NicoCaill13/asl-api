-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'TREASURER');

-- CreateEnum
CREATE TYPE "InvoiceStatut" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY');

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
    "emailMain" TEXT NOT NULL,
    "emailOpt" TEXT NOT NULL,
    "lotNumber" INTEGER NOT NULL,
    "bankBalance" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "officeId" INTEGER NOT NULL,
    "password" TEXT NOT NULL DEFAULT 'asl_password',
    "acquisitionDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "utility" TEXT NOT NULL,
    "frequency" "Frequency" NOT NULL,
    "lastPaymentDate" TIMESTAMP(3),
    "amount" DOUBLE PRECISION,
    "quoteId" INTEGER,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "range" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "contractId" INTEGER NOT NULL,
    "status" "InvoiceStatut" NOT NULL DEFAULT 'PENDING',
    "filePath" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Office_email_key" ON "Office"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bankAccount_officeId_key" ON "bankAccount"("officeId");

-- CreateIndex
CREATE UNIQUE INDEX "CoOwnership_emailMain_key" ON "CoOwnership"("emailMain");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_quoteId_key" ON "Contract"("quoteId");

-- AddForeignKey
ALTER TABLE "bankAccount" ADD CONSTRAINT "bankAccount_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoOwnership" ADD CONSTRAINT "CoOwnership_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
