import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { authUtils } from '../utils';

const languagesFilePath = path.resolve(process.env.STATIC_FILES_DIRECTORY ?? '', 'languages/languages.json');

export async function getLanguages(req: Request, res: Response) {
    if (!fs.existsSync(languagesFilePath)) {
        return res.end('{}');
    }

    res.setHeader('content-type', 'application/json');
    return res.end(fs.readFileSync(languagesFilePath));
}

export async function storeLanguages(req: Request, res: Response) {
    if (!(await authUtils.isAuthorized(req))) {
        return authUtils.respondUnauthorized(res);
    }

    const directory = path.dirname(languagesFilePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    const data = JSON.stringify(req.body);
    fs.writeFileSync(languagesFilePath, data);

    return res.end(data);
}