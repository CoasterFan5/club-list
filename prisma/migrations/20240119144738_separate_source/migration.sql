/*
  Warnings:

  - You are about to drop the column `source` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "source",
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "userAgent" TEXT;
