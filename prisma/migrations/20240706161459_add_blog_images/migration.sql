-- CreateTable
CREATE TABLE "BlogImage" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "BlogImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlogImage" ADD CONSTRAINT "BlogImage_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogArticle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
