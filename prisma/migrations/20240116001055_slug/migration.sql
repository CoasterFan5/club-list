-- CreateTable
CREATE TABLE "Slug" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "slug" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Slug_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Slug_slug_key" ON "Slug"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Slug_organizationId_key" ON "Slug"("organizationId");

-- AddForeignKey
ALTER TABLE "Slug" ADD CONSTRAINT "Slug_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
