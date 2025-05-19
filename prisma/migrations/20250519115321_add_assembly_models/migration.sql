-- CreateTable
CREATE TABLE "Assembly" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assembly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssemblyParticipant" (
    "assemblyId" INTEGER NOT NULL,
    "coOwnershipId" INTEGER NOT NULL,

    CONSTRAINT "AssemblyParticipant_pkey" PRIMARY KEY ("assemblyId","coOwnershipId")
);

-- AddForeignKey
ALTER TABLE "AssemblyParticipant" ADD CONSTRAINT "AssemblyParticipant_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "Assembly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssemblyParticipant" ADD CONSTRAINT "AssemblyParticipant_coOwnershipId_fkey" FOREIGN KEY ("coOwnershipId") REFERENCES "CoOwnership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
