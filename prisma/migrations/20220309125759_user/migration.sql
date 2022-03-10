/*
  Warnings:

  - Added the required column `cardNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cvc` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryDate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cardNumber" TEXT NOT NULL,
ADD COLUMN     "cvc" INTEGER NOT NULL,
ADD COLUMN     "expiryDate" DATE NOT NULL;
