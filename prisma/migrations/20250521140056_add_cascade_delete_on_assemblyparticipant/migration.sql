-- DropForeignKey
ALTER TABLE "AssemblyParticipant" DROP CONSTRAINT "AssemblyParticipant_assemblyId_fkey";

-- DropForeignKey
ALTER TABLE "AssemblyParticipant" DROP CONSTRAINT "AssemblyParticipant_coOwnershipId_fkey";

-- AddForeignKey
ALTER TABLE "AssemblyParticipant" ADD CONSTRAINT "AssemblyParticipant_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "Assembly"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssemblyParticipant" ADD CONSTRAINT "AssemblyParticipant_coOwnershipId_fkey" FOREIGN KEY ("coOwnershipId") REFERENCES "CoOwnership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
