/*
  Warnings:

  - You are about to drop the column `role` on the `OrgUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrgUser" DROP COLUMN "role",
ADD COLUMN     "roleId" INTEGER;
ALTER TABLE "OrgUser" ADD COLUMN     "owner" BOOLEAN NOT NULL DEFAULT false;

UPDATE "OrgUser"
SET "owner" = TRUE
WHERE EXISTS (
    SELECT 1
    FROM "Organization"
    WHERE "OrgUser"."organizationId" = "Organization".id AND "OrgUser"."userId" = "Organization"."ownerId"
);

-- CreateTable
CREATE TABLE "OrgRole" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "permissionInt" INTEGER NOT NULL,
    "orgid" INTEGER NOT NULL,

    CONSTRAINT "OrgRole_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrgUser" ADD CONSTRAINT "OrgUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "OrgRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgRole" ADD CONSTRAINT "OrgRole_orgid_fkey" FOREIGN KEY ("orgid") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Organization` table. All the data in the column will be lost.

*/
-- DropForeignKey
-- Alter Table!
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ownerId_fkey";
ALTER TABLE "Organization" DROP COLUMN "ownerId";

