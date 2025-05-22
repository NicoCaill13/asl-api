/*
  Warnings:

  - Made the column `assemblyId` on table `AssemblyParticipant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coOwnershipId` on table `AssemblyParticipant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AssemblyParticipant" DROP CONSTRAINT "AssemblyParticipant_assemblyId_fkey";

-- DropForeignKey
ALTER TABLE "AssemblyParticipant" DROP CONSTRAINT "AssemblyParticipant_coOwnershipId_fkey";

-- AlterTable
ALTER TABLE "AssemblyParticipant" ALTER COLUMN "assemblyId" SET NOT NULL,
ALTER COLUMN "coOwnershipId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AssemblyParticipant" ADD CONSTRAINT "AssemblyParticipant_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "Assembly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssemblyParticipant" ADD CONSTRAINT "AssemblyParticipant_coOwnershipId_fkey" FOREIGN KEY ("coOwnershipId") REFERENCES "CoOwnership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
