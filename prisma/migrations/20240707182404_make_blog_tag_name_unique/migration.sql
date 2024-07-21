/*
  Warnings:

  - A unique constraint covering the columns `[tagName]` on the table `BlogTagTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BlogTagTemplate_tagName_key" ON "BlogTagTemplate"("tagName");
