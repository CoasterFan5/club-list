-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ClubRole" DROP CONSTRAINT "ClubRole_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubUser" DROP CONSTRAINT "ClubUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_clubId_fkey";

-- DropForeignKey
ALTER TABLE "OrgUser" DROP CONSTRAINT "OrgUser_userId_fkey";

-- AddForeignKey
ALTER TABLE "OrgUser" ADD CONSTRAINT "OrgUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubUser" ADD CONSTRAINT "ClubUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRole" ADD CONSTRAINT "ClubRole_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
