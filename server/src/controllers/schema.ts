import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { authUtils } from 'src/utils';

export async function getList(req: Request, res: Response) {
    if (!(await authUtils.isAuthorized(req, res))) {
        return;
    }

    const schemasDirectoryPath = path.resolve(__dirname, '../../../schemas');
    if (!fs.existsSync(schemasDirectoryPath)) {
        return res.end('[]');
    }

    const schemas = [];
    const schemasFiles = fs.readdirSync(schemasDirectoryPath);

    for (let file of schemasFiles) {
        const filePath = `${schemasDirectoryPath}/${file}`;
        const fileStats = fs.lstatSync(filePath);
        if (file.endsWith('.json') && !file.startsWith('current') && fileStats.isFile()) {
            const content = fs.readFileSync(filePath);
            try {
                const schema = JSON.parse(content.toString());
                schemas.push({
                    id: schema.id,
                    version: schema.version,
                    current: schema.current,
                    createdAt: schema.createdAt,
                    updatedAt: schema.updatedAt,
                });
            } catch (err) {
                //
            }
        }
    }

    return res.end(JSON.stringify(schemas));
}