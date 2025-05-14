/*
  Warnings:

  - You are about to drop the `Planning` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Planning" DROP CONSTRAINT "Planning_roomId_fkey";

-- DropTable
DROP TABLE "Planning";
