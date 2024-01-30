-- Set the organizationId to the ClubUser's club's organizationId
ALTER TABLE "ClubUser" ADD COLUMN     "organizationId" INTEGER NOT NULL DEFAULT 0;
UPDATE "ClubUser" SET "organizationId" = "Club"."organizationId" FROM "Club" WHERE "Club"."id" = "ClubUser"."clubId";

-- AddForeignKey
ALTER TABLE "ClubUser" ADD CONSTRAINT "ClubUser_userId_organizationId_fkey" FOREIGN KEY ("userId", "organizationId") REFERENCES "OrgUser"("userId", "organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
