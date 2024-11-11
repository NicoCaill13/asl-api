/*
  Warnings:

  - You are about to drop the column `contractId` on the `Quote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quoteId]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_contractId_fkey";

-- DropIndex
DROP INDEX "Quote_contractId_key";

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "quoteId" INTEGER;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "contractId";

-- CreateIndex
CREATE UNIQUE INDEX "Contract_quoteId_key" ON "Contract"("quoteId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
