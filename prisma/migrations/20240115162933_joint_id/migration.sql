/*
  Warnings:

  - The primary key for the `ClubUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ClubUser` table. All the data in the column will be lost.
  - The primary key for the `OrgUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrgUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClubUser" DROP CONSTRAINT "ClubUser_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ClubUser_pkey" PRIMARY KEY ("clubId", "userId");

-- AlterTable
ALTER TABLE "OrgUser" DROP CONSTRAINT "OrgUser_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "OrgUser_pkey" PRIMARY KEY ("organizationId", "userId");
