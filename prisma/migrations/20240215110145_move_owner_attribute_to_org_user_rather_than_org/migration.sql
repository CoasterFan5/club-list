/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Organization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ownerId_fkey";

-- AlterTable
ALTER TABLE "OrgUser" ADD COLUMN     "owner" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "ownerId";
