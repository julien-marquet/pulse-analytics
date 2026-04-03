/*
  Warnings:

  - You are about to drop the column `receivedAt` on the `Event` table. All the data in the column will be lost.
  - Added the required column `clientReceivedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverReceivedAt` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" RENAME COLUMN "receivedAt" TO "serverReceivedAt";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "clientReceivedAt" TIMESTAMPTZ(3) NOT NULL;