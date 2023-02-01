import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { authUtils } from '../utils';

const languagesFilePath = path.resolve(process.env.STATIC_FILES_DIRECTORY ?? '', 'languages/languages.json');

export async function getLanguages(req: Request, res: Response) {
    if (!(await authUtils.isAuthorized(req, res))) {
        return;
    }

    if (!fs.existsSync(languagesFilePath)) {
        return res.end('{}');
    }

    return res.end(fs.readFileSync(languagesFilePath));
}

export async function storeLanguages(req: Request, res: Response) {
    if (!(await authUtils.isAuthorized(req, res))) {
        return;
    }

    const directory = path.dirname(languagesFilePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    const data = JSON.stringify(req.body);
    fs.writeFileSync(languagesFilePath, data);

    return res.end(data);
}