/*
  Warnings:

  - You are about to drop the `like` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_post_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "login_failed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "like";

-- CreateTable
CREATE TABLE "postlike" (
    "like_id" SERIAL NOT NULL,
    "likedBy" INTEGER NOT NULL,
    "post_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment_id" INTEGER,

    CONSTRAINT "postlike_pkey" PRIMARY KEY ("like_id")
);

-- AddForeignKey
ALTER TABLE "postlike" ADD CONSTRAINT "postlike_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postlike" ADD CONSTRAINT "postlike_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("comment_id") ON DELETE SET NULL ON UPDATE CASCADE;
