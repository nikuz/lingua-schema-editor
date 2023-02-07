-- CreateTable
CREATE TABLE "dictionary" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "word" VARCHAR(256) NOT NULL,
    "translation" VARCHAR(256) NOT NULL,
    "translate_from" JSONB NOT NULL,
    "translate_to" JSONB NOT NULL,
    "image" TEXT NOT NULL,
    "pronunciation_from" TEXT NOT NULL,
    "pronunciation_to" TEXT NOT NULL,
    "schema_version" VARCHAR(10) NOT NULL,
    "raw" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "dictionary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dictionary_hash_key" ON "dictionary"("hash");
