/*
  Warnings:

  - Added the required column `articleName` to the `BlogArticle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogArticle" ADD COLUMN     "articleName" TEXT NOT NULL;
