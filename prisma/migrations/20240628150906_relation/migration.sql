/*
  Warnings:

  - Made the column `officeId` on table `CoOwnership` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CoOwnership" DROP CONSTRAINT "CoOwnership_officeId_fkey";

-- AlterTable
ALTER TABLE "CoOwnership" ALTER COLUMN "officeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CoOwnership" ADD CONSTRAINT "CoOwnership_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
