/*
  Warnings:

  - You are about to drop the column `likeCount` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the column `parentThreadId` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the column `replyCount` on the `Thread` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_parentThreadId_fkey";

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "likeCount",
DROP COLUMN "parentThreadId",
DROP COLUMN "replyCount";
