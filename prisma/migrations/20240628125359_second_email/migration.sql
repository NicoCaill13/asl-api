/*
  Warnings:

  - You are about to drop the column `email` on the `CoOwnership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailMain]` on the table `CoOwnership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[emailOpt]` on the table `CoOwnership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailMain` to the `CoOwnership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailOpt` to the `CoOwnership` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CoOwnership_email_key";

-- AlterTable
ALTER TABLE "CoOwnership" DROP COLUMN "email",
ADD COLUMN     "emailMain" TEXT NOT NULL,
ADD COLUMN     "emailOpt" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CoOwnership_emailMain_key" ON "CoOwnership"("emailMain");

-- CreateIndex
CREATE UNIQUE INDEX "CoOwnership_emailOpt_key" ON "CoOwnership"("emailOpt");
