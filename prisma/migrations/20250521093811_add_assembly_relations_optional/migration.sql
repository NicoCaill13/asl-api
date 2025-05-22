-- CreateTable
CREATE TABLE "AssemblyParticipant" (
    "id" SERIAL NOT NULL,
    "assemblyId" INTEGER,
    "coOwnershipId" INTEGER,

    CONSTRAINT "AssemblyParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundCallPayment" (
    "id" SERIAL NOT NULL,
    "fundCallId" INTEGER NOT NULL,
    "coOwnershipId" INTEGER NOT NULL,
    "installment" INTEGER NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundCallPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FundCallPayment_fundCallId_coOwnershipId_installment_key" ON "FundCallPayment"("fundCallId", "coOwnershipId", "installment");

-- AddForeignKey
ALTER TABLE "AssemblyParticipant" ADD CONSTRAINT "AssemblyParticipant_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "Assembly"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssemblyParticipant" ADD CONSTRAINT "AssemblyParticipant_coOwnershipId_fkey" FOREIGN KEY ("coOwnershipId") REFERENCES "CoOwnership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundCallPayment" ADD CONSTRAINT "FundCallPayment_fundCallId_fkey" FOREIGN KEY ("fundCallId") REFERENCES "FundCall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundCallPayment" ADD CONSTRAINT "FundCallPayment_coOwnershipId_fkey" FOREIGN KEY ("coOwnershipId") REFERENCES "CoOwnership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
