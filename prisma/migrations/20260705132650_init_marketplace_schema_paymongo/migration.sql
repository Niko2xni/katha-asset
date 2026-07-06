/*
  Warnings:

  - You are about to drop the column `stripeSessionId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymongoSessionId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymongoSessionId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_stripeSessionId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "stripeSessionId",
ADD COLUMN     "paymongoSessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymongoSessionId_key" ON "Order"("paymongoSessionId");
