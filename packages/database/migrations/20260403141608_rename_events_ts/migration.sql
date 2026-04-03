/*
  Warnings:

  - You are about to drop the column `clientReceivedAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `serverReceivedAt` on the `Event` table. All the data in the column will be lost.
  - Added the required column `emittedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receivedAt` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" RENAME COLUMN "clientReceivedAt" TO "emittedAt";
ALTER TABLE "Event" RENAME COLUMN "serverReceivedAt" TO "receivedAt";