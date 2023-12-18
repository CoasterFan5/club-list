/*
  Warnings:

  - You are about to drop the column `priority` on the `ClubRole` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `ClubUser` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `ClubUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClubRole" DROP COLUMN "priority";

-- AlterTable
ALTER TABLE "ClubUser" DROP COLUMN "permissions",
ADD COLUMN     "roleId" INTEGER;

-- AddForeignKey
ALTER TABLE "ClubUser" ADD CONSTRAINT "ClubUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "ClubRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
