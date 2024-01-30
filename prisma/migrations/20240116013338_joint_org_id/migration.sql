/*
  Warnings:

  - The primary key for the `ClubUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ClubUser" DROP CONSTRAINT "ClubUser_userId_organizationId_fkey";

-- AlterTable
ALTER TABLE "ClubUser" DROP CONSTRAINT "ClubUser_pkey",
ALTER COLUMN "organizationId" DROP DEFAULT,
ADD CONSTRAINT "ClubUser_pkey" PRIMARY KEY ("clubId", "userId", "organizationId");

-- AddForeignKey
ALTER TABLE "ClubUser" ADD CONSTRAINT "ClubUser_userId_organizationId_fkey" FOREIGN KEY ("userId", "organizationId") REFERENCES "OrgUser"("userId", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;
