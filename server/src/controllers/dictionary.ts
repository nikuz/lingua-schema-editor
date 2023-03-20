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

function checkImage(image: string, res: Response): boolean {
    const imageData = image.match(IMAGE_BASE64_REG);
    if (!imageData) {
        res.status(406);
        res.end('Image is not in base64 format');
        return false;
    }

    return true;
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

function checkPronunciation(pronunciation: string, res: Response): boolean {
    const pronunciationData = pronunciation.match(PRONUNCIATION_BASE64_REG);
    if (!pronunciationData) {
        res.status(406);
        res.end('Pronunciation is not in base64 format');
        return false;
    }

    return true;
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
    const hash: string = body.hash;
    const translateFrom: string = body.translate_from;
    const translateTo: string = body.translate_to;
    const image: string = body.image;
    const pronunciationFrom: string = body.pronunciation_from;
    const pronunciationTo: string = body.pronunciation_to;
    const schemaVersion: string = body.schema_version;
    const raw: string = body.raw;

    if (!signature
        || !word
        || !translation
        || !checkSignature(signature, word, translation)
        || !hash
        || !translateFrom
        || !translateTo
        || !image
        || !pronunciationFrom
        || !pronunciationTo
        || !schemaVersion
        || !raw
    ) {
        res.status(406);
        return res.end('Incorrect body parameters');
    }

    if (!checkImage(image, res)
        || !checkPronunciation(pronunciationFrom, res)
        || !checkPronunciation(pronunciationTo, res)
    ) {
        return;
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
                hash,
                translation,
                translate_from: translateFromJson,
                translate_to: translateToJson,
                schema_version: schemaVersion,
                raw,
            },
        });
    } catch (err: any) {
        res.status(500);
        return res.end(`Can't save dictionary entry: ${err?.code}`);
    }

    if (newDictionaryEntry) {
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
    }

    res.status(201);
    return res.end('OK');
}

export async function update(req: Request, res: Response) {
    const body = req.body;
    const signature: string = body.signature;
    const word: string = body.word;
    const translation: string = body.translation;
    const hash: string = body.hash;
    const image: string = body.image;
    const pronunciationTo: string = body.pronunciation_to;
    const schemaVersion: string = body.schema_version;

    if (!signature
        || !word
        || !translation
        || !checkSignature(signature, word, translation)
        || !hash
        || !image
        || !pronunciationTo
        || !schemaVersion
    ) {
        res.status(406);
        return res.end('Incorrect body parameters');
    }

    if (!checkImage(image, res) || !checkPronunciation(pronunciationTo, res)) {
        return;
    }

    const dictionaryEntry = await prisma.dictionary.findFirst({
        where: {
            hash: hash,
        },
    });

    if (dictionaryEntry) {
        saveImage(dictionaryEntry.id, word, image);
        savePronunciation(dictionaryEntry.id, 'to', word, pronunciationTo);

        try {
            await prisma.dictionary.update({
                where: {
                    hash: hash,
                },
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