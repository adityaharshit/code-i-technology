-- CreateTable
CREATE TABLE "marksheets" (
    "id" SERIAL NOT NULL,
    "marksheetNumber" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "studentName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "cfMarks" INTEGER,
    "msOfficeMarks" INTEGER,
    "tallyMarks" INTEGER,
    "photoshopMarks" INTEGER,
    "ihnMarks" INTEGER,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marksheets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "marksheets_marksheetNumber_key" ON "marksheets"("marksheetNumber");

-- CreateIndex
CREATE UNIQUE INDEX "marksheets_studentId_courseId_key" ON "marksheets"("studentId", "courseId");

-- AddForeignKey
ALTER TABLE "marksheets" ADD CONSTRAINT "marksheets_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marksheets" ADD CONSTRAINT "marksheets_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
