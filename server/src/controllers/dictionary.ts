import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { cryptoUtils } from '../utils';

const IMAGES_DIRECTORY = path.resolve(process.env.STATIC_FILES_DIRECTORY ?? '', 'images');
const IMAGE_BASE64_REG = /^data:image\/(jpeg|png|jpg);base64,(.+)$/;
const PRONUNCIATIONS_DIRECTORY = path.resolve(process.env.STATIC_FILES_DIRECTORY ?? '', 'pronunciations');
const PRONUNCIATION_BASE64_REG = /^data:audio\/mpeg;base64,(.+)$/;

function checkSignature(signature: string, word: string, translation: string): boolean {
    let signatureData;

    try {
        const decodedSignature = cryptoUtils.decrypt(signature);
        signatureData = JSON.parse(decodedSignature);
    } catch (e) {
        //
    }

    return signatureData && signatureData.word === word && signatureData.translation === translation;
}

function checkImage(image: string): boolean {
    return !!image.match(IMAGE_BASE64_REG);
}

function saveImage(id: number, word: string, image: string): string | undefined {
    const imageData = image.match(IMAGE_BASE64_REG);
    if (!imageData) {
        return;
    }

    if (!fs.existsSync(IMAGES_DIRECTORY)) {
        fs.mkdirSync(IMAGES_DIRECTORY);
    }

    const imageExtension = imageData[1];
    const fileName = `${id}-${word}.${imageExtension}`;
    const filePath = `${IMAGES_DIRECTORY}/${fileName}`;
    fs.writeFileSync(filePath, imageData[2], 'base64');

    return `/images/${fileName}`;
}

function checkPronunciation(pronunciation: string): boolean {
    return !!pronunciation.match(PRONUNCIATION_BASE64_REG);
}

function savePronunciation(id: number, prefix: string, word: string, pronunciation: string): string | undefined {
    const pronunciationData = pronunciation.match(PRONUNCIATION_BASE64_REG);
    if (!pronunciationData) {
        return;
    }

    if (!fs.existsSync(PRONUNCIATIONS_DIRECTORY)) {
        fs.mkdirSync(PRONUNCIATIONS_DIRECTORY);
    }

    const fileName = `${id}-${prefix}-${word}.mp3`;
    const filePath = `${PRONUNCIATIONS_DIRECTORY}/${fileName}`;
    fs.writeFileSync(filePath, pronunciationData[1], 'base64');

    return `/pronunciations/${fileName}`;
}

// ----------------
// public methods
// ----------------

export async function save(req: Request, res: Response) {
    const body = req.body;
    const signature: string = body.signature;
    const word: string = body.word;
    const translation: string = body.translation;
    const translateFrom: string = body.translate_from;
    const translateTo: string = body.translate_to;
    const image: string = body.image;
    const pronunciationFrom: string = body.pronunciation_from;
    const pronunciationTo: string = body.pronunciation_to;
    const schemaVersion: string = body.schema_version;
    const raw: JSON = body.raw;

    if (!signature
        || !word
        || !translation
        || !checkSignature(signature, word, translation)
        || !translateFrom
        || !translateTo
        || !image
        || !checkImage(image)
        || !pronunciationFrom
        || !checkPronunciation(pronunciationFrom)
        || !pronunciationTo
        || !checkPronunciation(pronunciationTo)
        || !schemaVersion
        || !raw
    ) {
        res.status(406);
        return res.end('Incorrect body parameters');
    }

    let translateFromJson;
    let translateToJson;
    try {
        translateFromJson = JSON.parse(translateFrom);
        translateToJson = JSON.parse(translateTo);
    } catch (e) {
        res.status(406);
        return res.end('Failed data structure integrity test');
    }

    let newDictionaryEntry;
    try {
        newDictionaryEntry = await prisma.dictionary.create({
            data: {
                word,
                translation,
                translate_from: translateFromJson,
                translate_to: translateToJson,
                schema_version: schemaVersion,
                raw: JSON.stringify(raw),
            },
        });
    } catch (err: any) {
        res.status(500);
        return res.end(`Can't save dictionary entry: ${err?.code}`);
    }

    const imagePath = saveImage(newDictionaryEntry.id, word, image);
    const pronunciationFromPath = savePronunciation(newDictionaryEntry.id, 'from', word, pronunciationFrom);
    const pronunciationToPath = savePronunciation(newDictionaryEntry.id, 'to', word, pronunciationTo);
    await prisma.dictionary.update({
        where: {
            id: newDictionaryEntry.id,
        },
        data: {
            image: imagePath,
            pronunciation_from: pronunciationFromPath,
            pronunciation_to: pronunciationToPath,
        },
    });

    res.status(201);
    return res.end(newDictionaryEntry.id.toString());
}

export async function update(req: Request, res: Response) {
    const body = req.body;
    const signature: string = body.signature;
    const id: number = body.id;
    const word: string = body.word;
    const translation: string = body.translation;
    const image: string = body.image;
    const pronunciationTo: string = body.pronunciation_to;
    const schemaVersion: string = body.schema_version;

    if (!signature
        || !id
        || !word
        || !translation
        || !checkSignature(signature, word, translation)
        || !schemaVersion
    ) {
        res.status(406);
        return res.end('Incorrect body parameters');
    }

    const dictionaryEntry = await prisma.dictionary.findFirst({
        where: { id },
    });

    if (dictionaryEntry) {
        if (image && checkImage(image)) {
            saveImage(dictionaryEntry.id, word, image);
        }
        if (pronunciationTo && checkPronunciation(pronunciationTo)) {
            savePronunciation(dictionaryEntry.id, 'to', word, pronunciationTo);
        }

        try {
            await prisma.dictionary.update({
                where: { id },
                data: {
                    translation,
                    schema_version: schemaVersion,
                    updated_at: new Date().toISOString(),
                },
            });
        } catch (err: any) {
            res.status(500);
            return res.end(`Can't update dictionary entry: ${err?.code}`);
        }
    } else {
        res.status(404);
        return res.end('Can\'t find dictionary entry');
    }

    return res.end('OK');
}