-- AlterTable
ALTER TABLE "Punishment" ADD COLUMN     "clubId" INTEGER,
ADD COLUMN     "reason" TEXT;

-- AddForeignKey
ALTER TABLE "Punishment" ADD CONSTRAINT "Punishment_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
