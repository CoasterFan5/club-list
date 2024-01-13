/*
  Warnings:

  - Added the required column `role` to the `OrgUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "imageURL" TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "OrgUser" ADD COLUMN     "role" TEXT NOT NULL;
