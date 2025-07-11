/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId]` on the table `following` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "following_followingId_followerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "following_followerId_followingId_key" ON "following"("followerId", "followingId");
