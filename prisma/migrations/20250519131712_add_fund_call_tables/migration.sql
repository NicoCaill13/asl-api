-- CreateTable
CREATE TABLE "FundCall" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment" TEXT NOT NULL,

    CONSTRAINT "FundCall_pkey" PRIMARY KEY ("id")
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
ALTER TABLE "FundCallPayment" ADD CONSTRAINT "FundCallPayment_fundCallId_fkey" FOREIGN KEY ("fundCallId") REFERENCES "FundCall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundCallPayment" ADD CONSTRAINT "FundCallPayment_coOwnershipId_fkey" FOREIGN KEY ("coOwnershipId") REFERENCES "CoOwnership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
