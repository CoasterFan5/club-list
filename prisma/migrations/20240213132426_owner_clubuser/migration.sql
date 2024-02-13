ALTER TABLE "ClubUser" ADD COLUMN     "owner" BOOLEAN NOT NULL;

UPDATE "ClubUser"
SET "owner" = TRUE
WHERE EXISTS (
    SELECT 1
    FROM "Club"
    WHERE "ClubUser"."clubId" = "Club".id AND "ClubUser"."userId" = "Club"."ownerId"
);

ALTER TABLE "Club" DROP CONSTRAINT "Club_ownerId_fkey";
ALTER TABLE "Club" DROP COLUMN "ownerId";