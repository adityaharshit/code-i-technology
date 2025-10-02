-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "months" DROP NOT NULL;
