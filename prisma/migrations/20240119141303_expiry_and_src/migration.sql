-- AlterTable
ALTER TABLE "Ban" ADD COLUMN     "expiryDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "source" TEXT;
