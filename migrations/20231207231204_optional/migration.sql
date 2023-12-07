-- DropForeignKey
ALTER TABLE "ClubUser" DROP CONSTRAINT "ClubUser_roleId_fkey";

-- AlterTable
ALTER TABLE "ClubUser" ALTER COLUMN "roleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ClubUser" ADD CONSTRAINT "ClubUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "ClubRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
