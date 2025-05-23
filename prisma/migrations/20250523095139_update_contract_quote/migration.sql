/*
  Warnings:

  - The `utility` column on the `Contract` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Utility" AS ENUM ('ELECTRICITY', 'WATER', 'INSURANCE', 'MAINTENANCE', 'GREEN_SPACE');

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "utility",
ADD COLUMN     "utility" "Utility" NOT NULL DEFAULT 'ELECTRICITY';

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "utility" "Utility" NOT NULL DEFAULT 'ELECTRICITY';
