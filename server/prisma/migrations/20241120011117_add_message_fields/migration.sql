-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "senderEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "senderName" TEXT NOT NULL DEFAULT '';
