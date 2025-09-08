-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "courseIncludes" JSONB,
ADD COLUMN     "instructorDetails" TEXT,
ADD COLUMN     "instructorName" VARCHAR(100),
ADD COLUMN     "language" VARCHAR(50),
ADD COLUMN     "skillLevel" VARCHAR(50),
ADD COLUMN     "whatYouWillLearn" JSONB;
