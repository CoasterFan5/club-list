-- AlterTable
ALTER TABLE "User" ADD COLUMN     "siteAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "BlogArticle" (
    "id" SERIAL NOT NULL,
    "articleURL" TEXT NOT NULL,
    "articleText" TEXT NOT NULL,

    CONSTRAINT "BlogArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignedBlogTag" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "AssignedBlogTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogTagTemplate" (
    "id" SERIAL NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "BlogTagTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssignedBlogTag" ADD CONSTRAINT "AssignedBlogTag_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogArticle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedBlogTag" ADD CONSTRAINT "AssignedBlogTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "BlogTagTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
