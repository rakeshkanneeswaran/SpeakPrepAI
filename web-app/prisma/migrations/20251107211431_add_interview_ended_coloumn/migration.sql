-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "interviewOpen" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "availableCredits" INTEGER NOT NULL DEFAULT 0;
