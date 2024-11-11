-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "frequency_new" "Frequency";
