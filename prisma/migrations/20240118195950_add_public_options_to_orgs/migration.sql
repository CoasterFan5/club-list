-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "discoverable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hideSensitive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false;
