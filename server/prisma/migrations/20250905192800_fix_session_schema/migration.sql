/*
  Warnings:

  - You are about to drop the column `expire` on the `session` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
-- DROP INDEX "session_expire_idx";

-- AlterTable
-- ALTER TABLE "session" DROP COLUMN "expire",
-- ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- -- CreateIndex
-- CREATE INDEX "session_expiresAt_idx" ON "session"("expiresAt");
