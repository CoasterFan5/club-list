/*
  Warnings:

  - You are about to drop the `Punishment` table. If the table is not empty, all the data it contains will be lost.

*/

-- Rename table
ALTER TABLE "Punishment" RENAME TO "Ban";

-- DropForeignKey
ALTER TABLE "Ban" DROP CONSTRAINT "Punishment_clubId_fkey";
ALTER TABLE "Ban" DROP CONSTRAINT "Punishment_orgId_fkey";
ALTER TABLE "Ban" DROP CONSTRAINT "Punishment_userId_fkey";

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
