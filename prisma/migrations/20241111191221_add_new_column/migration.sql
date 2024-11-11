/*
  Warnings:

  - You are about to drop the column `frequency_new` on the `Contract` table. All the data in the column will be lost.
  - Changed the type of `frequency` on the `Contract` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "frequency_new",
DROP COLUMN "frequency",
ADD COLUMN     "frequency" "Frequency" NOT NULL;
