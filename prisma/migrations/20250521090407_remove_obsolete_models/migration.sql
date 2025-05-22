/*
  Warnings:

  - You are about to drop the `AssemblyParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FundCallPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssemblyParticipant" DROP CONSTRAINT "AssemblyParticipant_assemblyId_fkey";

-- DropForeignKey
ALTER TABLE "AssemblyParticipant" DROP CONSTRAINT "AssemblyParticipant_coOwnershipId_fkey";

-- DropForeignKey
ALTER TABLE "FundCallPayment" DROP CONSTRAINT "FundCallPayment_coOwnershipId_fkey";

-- DropForeignKey
ALTER TABLE "FundCallPayment" DROP CONSTRAINT "FundCallPayment_fundCallId_fkey";

-- DropTable
DROP TABLE "AssemblyParticipant";

-- DropTable
DROP TABLE "FundCallPayment";
