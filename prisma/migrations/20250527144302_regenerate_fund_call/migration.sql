/*
  Warnings:

  - Added the required column `reference` to the `FundCall` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FundCall" ADD COLUMN     "reference" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FundCallPayment" ADD COLUMN     "dueDate" TIMESTAMP(3);
