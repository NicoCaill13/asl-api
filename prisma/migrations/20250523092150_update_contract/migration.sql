/*
  Warnings:

  - You are about to drop the column `lastPaymentDate` on the `Contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "lastPaymentDate",
ADD COLUMN     "paymentDate" TIMESTAMP(3);
