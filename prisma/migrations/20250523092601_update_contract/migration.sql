/*
  Warnings:

  - You are about to drop the column `paymentDate` on the `Contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "paymentDate",
ADD COLUMN     "lastPaymentDate" TIMESTAMP(3);
