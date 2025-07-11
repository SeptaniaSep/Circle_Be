-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_parentThreadId_fkey";

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_parentThreadId_fkey" FOREIGN KEY ("parentThreadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
