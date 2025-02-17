/*
  Warnings:

  - You are about to drop the `InvoiceCoOwner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `officeId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InvoiceCoOwner" DROP CONSTRAINT "InvoiceCoOwner_coOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceCoOwner" DROP CONSTRAINT "InvoiceCoOwner_invoiceId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "officeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "InvoiceCoOwner";

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
