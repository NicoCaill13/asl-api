-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "contractId" INTEGER,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;
