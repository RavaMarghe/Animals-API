/*
  Warnings:

  - You are about to drop the `Planet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Planet";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Animal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "breed" TEXT NOT NULL,
    "weigth" INTEGER NOT NULL,
    "name" TEXT,
    "photoFilename" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT
);
