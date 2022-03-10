/*
  Warnings:

  - You are about to drop the column `cardNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cvc` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `User` table. All the data in the column will be lost.
  - Added the required column `stipeSourceId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cardNumber",
DROP COLUMN "cvc",
DROP COLUMN "expiryDate",
ADD COLUMN     "stipeSourceId" TEXT NOT NULL;
