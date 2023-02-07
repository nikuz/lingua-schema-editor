import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { cryptoUtils } from '../utils';

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
    const raw: string = body.raw;

    if (!signature
        || !word
        || !translation
        || !checkSignature(signature, word, translation)
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

    let translateFromJson;
    let translateToJson;
    try {
        translateFromJson = JSON.parse(translateFrom);
        translateToJson = JSON.parse(translateTo);
    } catch (e) {
        res.status(406);
        return res.end('Failed data structure integrity test');
    }

    const newWord = await prisma.dictionary.create({
        data: {
            word,
            translation,
            translate_from: translateFromJson,
            translate_to: translateToJson,
            image,
            pronunciation_from: pronunciationFrom,
            pronunciation_to: pronunciationTo,
            schema_version: schemaVersion,
            raw,
        },
    });

    return res.end(newWord.hash);
}

export async function update(req: Request, res: Response) {
    const body = req.body;
    const signature: string = body.signature;
    const hash: string = body.hash;
    const word: string = body.word;
    const translation: string = body.translation;
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

    await prisma.dictionary.update({
        where: {
            hash: hash,
        },
        data: {
            translation,
            image,
            pronunciation_to: pronunciationTo,
            schema_version: schemaVersion,
            updated_at: new Date().toISOString(),
        },
    });

    return res.end('OK');
}