-- CreateTable
CREATE TABLE "Animal" (
    "id" SERIAL NOT NULL,
    "breed" VARCHAR(255) NOT NULL,
    "weight" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "photoFilename" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);
