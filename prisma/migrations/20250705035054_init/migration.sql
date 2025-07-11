-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "parentThreadId" TEXT,
ADD COLUMN     "replyCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_parentThreadId_fkey" FOREIGN KEY ("parentThreadId") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;
