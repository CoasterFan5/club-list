/*
  Warnings:

  - A unique constraint covering the columns `[csId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `csId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "csId" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "session" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_csId_key" ON "User"("csId");

-- CreateIndex
CREATE UNIQUE INDEX "User_session_key" ON "User"("session");
