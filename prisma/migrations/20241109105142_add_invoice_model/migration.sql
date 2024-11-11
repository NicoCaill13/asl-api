-- CreateEnum
CREATE TYPE "InvoiceStatut" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "lastPaymentDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "filePath" TEXT,
ADD COLUMN     "status" "InvoiceStatut" NOT NULL DEFAULT 'PENDING';
