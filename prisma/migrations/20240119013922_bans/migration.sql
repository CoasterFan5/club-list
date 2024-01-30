-- Rename table
ALTER TABLE "Punishment" RENAME TO "Ban";

-- Rename columns
ALTER TABLE "Ban" RENAME CONSTRAINT "Punishment_clubId_fkey" TO "Ban_clubId_fkey";
ALTER TABLE "Ban" RENAME CONSTRAINT "Punishment_orgId_fkey" TO "Ban_orgId_fkey";
ALTER TABLE "Ban" RENAME CONSTRAINT "Punishment_userId_fkey" TO "Ban_userId_fkey";
