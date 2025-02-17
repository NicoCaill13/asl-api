-- CreateTable
CREATE TABLE "InvoiceCoOwner" (
    "invoiceId" INTEGER NOT NULL,
    "coOwnerId" INTEGER NOT NULL,

    CONSTRAINT "InvoiceCoOwner_pkey" PRIMARY KEY ("invoiceId","coOwnerId")
);

-- AddForeignKey
ALTER TABLE "InvoiceCoOwner" ADD CONSTRAINT "InvoiceCoOwner_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceCoOwner" ADD CONSTRAINT "InvoiceCoOwner_coOwnerId_fkey" FOREIGN KEY ("coOwnerId") REFERENCES "CoOwnership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
