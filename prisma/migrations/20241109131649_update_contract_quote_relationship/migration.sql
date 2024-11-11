/*
  Warnings:

  - A unique constraint covering the columns `[contractId]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quote_contractId_key" ON "Quote"("contractId");
