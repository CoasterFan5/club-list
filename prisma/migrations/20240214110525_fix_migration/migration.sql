/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Club` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClubUser" ADD COLUMN     "owner" BOOLEAN NOT NULL DEFAULT false;
UPDATE "ClubUser"
SET "owner" = TRUE
WHERE EXISTS (
    SELECT 1
    FROM "Club"
    WHERE "ClubUser"."clubId" = "Club".id AND "ClubUser"."userId" = "Club"."ownerId"
);

ALTER TABLE "Club" DROP CONSTRAINT "Club_ownerId_fkey";
ALTER TABLE "Club" DROP COLUMN "ownerId";


