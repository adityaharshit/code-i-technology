/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `certificates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "photoUrl";

-- AlterTable
ALTER TABLE "marksheets" ADD COLUMN     "photoUrl" VARCHAR(500);
