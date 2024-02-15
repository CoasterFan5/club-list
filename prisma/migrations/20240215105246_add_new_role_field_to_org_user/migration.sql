/*
  Warnings:

  - You are about to drop the column `role` on the `OrgUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrgUser" DROP COLUMN "role",
ADD COLUMN     "roleId" INTEGER;

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
