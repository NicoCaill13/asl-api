/*
  Warnings:

  - You are about to drop the column `payment` on the `FundCall` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FundCallStatut" AS ENUM ('PENDING', 'PAID');

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_quoteId_fkey";

-- DropForeignKey
ALTER TABLE "FundCallPayment" DROP CONSTRAINT "FundCallPayment_coOwnershipId_fkey";

-- DropForeignKey
ALTER TABLE "FundCallPayment" DROP CONSTRAINT "FundCallPayment_fundCallId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_contractId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_officeId_fkey";

-- AlterTable
ALTER TABLE "FundCall" DROP COLUMN "payment",
ADD COLUMN     "statut" "FundCallStatut" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundCallPayment" ADD CONSTRAINT "FundCallPayment_fundCallId_fkey" FOREIGN KEY ("fundCallId") REFERENCES "FundCall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundCallPayment" ADD CONSTRAINT "FundCallPayment_coOwnershipId_fkey" FOREIGN KEY ("coOwnershipId") REFERENCES "CoOwnership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
