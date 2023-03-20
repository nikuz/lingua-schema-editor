/*
  Warnings:

  - You are about to drop the column `hash` on the `dictionary` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "dictionary_hash_key";

-- AlterTable
ALTER TABLE "dictionary" DROP COLUMN "hash";
