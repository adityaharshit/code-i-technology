/*
  Warnings:

  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "session";

-- CreateTable
CREATE TABLE "RollNumberSequence" (
    "year" INTEGER NOT NULL,
    "lastId" INTEGER NOT NULL,

    CONSTRAINT "RollNumberSequence_pkey" PRIMARY KEY ("year")
);
