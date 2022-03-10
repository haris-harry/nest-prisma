/*
  Warnings:

  - Changed the type of `planStartDate` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "planStartDate",
ADD COLUMN     "planStartDate" TIMESTAMP(3) NOT NULL;
