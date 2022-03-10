/*
  Warnings:

  - Added the required column `planStartDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runningPlan` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planStartDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "runningPlan" TEXT NOT NULL;
