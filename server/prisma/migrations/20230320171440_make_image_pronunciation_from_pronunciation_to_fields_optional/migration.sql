-- AlterTable
ALTER TABLE "dictionary" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "pronunciation_from" DROP NOT NULL,
ALTER COLUMN "pronunciation_to" DROP NOT NULL;
