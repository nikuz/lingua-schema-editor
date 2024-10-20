import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { authenticationController } from '../controllers';
import { schemaUtils, cryptoUtils } from '../utils';
import { CloudSchemaType } from '../types';

const encryptedSchemasCache: Record<string, string> = {};
const schemasDirectoryPath = path.resolve(process.env.STATIC_FILES_DIRECTORY ?? '', 'schemas');

export async function getList(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    if (!fs.existsSync(schemasDirectoryPath)) {
        res.end('[]');
        return;
    }

    const schemas = [];
    const schemasFiles = fs.readdirSync(schemasDirectoryPath);

    for (const file of schemasFiles) {
        const filePath = `${schemasDirectoryPath}/${file}`;
        const fileStats = fs.lstatSync(filePath);
        if (file.endsWith('.json') && !file.startsWith('current') && fileStats.isFile()) {
            const content = fs.readFileSync(filePath).toString();
            const schema = JSON.parse(content);
            schemas.push({
                id: schema.id,
                version: schema.version,
                current: schema.current,
                createdAt: schema.createdAt,
                updatedAt: schema.updatedAt,
            });
        }
    }

    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(schemas));
}

export async function add(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    if (!fs.existsSync(schemasDirectoryPath)) {
        fs.mkdirSync(schemasDirectoryPath);
    }

    const body = req.body;
    const filePath = path.resolve(schemasDirectoryPath, `${body.version}.json`);

    if (fs.existsSync(filePath)) {
        res.status(409);
        res.end('Schema with provided ID already exists');
        return;
    }

    const data = JSON.stringify(body);
    fs.writeFileSync(filePath, data);

    encryptedSchemasCache[body.version] = cryptoUtils.encrypt(data);

    res.setHeader('content-type', 'application/json');
    res.end(data);
}

export async function update(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    const params = req.params;
    const schemaPath = path.resolve(schemasDirectoryPath, `${params.id}.json`);

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        res.end('Can\'t find schema with provided id');
        return;
    }

    const body: CloudSchemaType = req.body;

    if (body.current && !schemaUtils.validateIntegrity(body.schema)) {
        res.status(406);
        res.end('Failed schema integrity check');
        return;
    }

    const data = JSON.stringify(body);
    fs.writeFileSync(schemaPath, data);

    if (body.current) {
        fs.writeFileSync(path.resolve(schemasDirectoryPath, 'current.json'), data);
    }

    encryptedSchemasCache[body.version] = cryptoUtils.encrypt(data);

    res.setHeader('content-type', 'application/json');
    res.end(data);
}

export async function get(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    const params = req.params;
    const schemaPath = path.resolve(schemasDirectoryPath, `${params.id}.json`);

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        res.end('Can\'t find schema with provided id');
        return;
    }

    res.setHeader('content-type', 'application/json');
    res.end(fs.readFileSync(schemaPath));
}

export function getEncrypted(req: Request, res: Response) {
    const params = req.params;
    const schemaPath = path.resolve(schemasDirectoryPath, `${params.id}.json`);

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        res.end('Can\'t find schema with provided id');
        return;
    }

    // take "current" schema from memory cache if available
    let data;
    if (encryptedSchemasCache[params.id]) {
        data = encryptedSchemasCache[params.id];
    } else {
        data = cryptoUtils.encrypt(fs.readFileSync(schemaPath).toString());
        encryptedSchemasCache[params.id] = data;
    }

    res.end(data);
}

export async function setCurrent(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    if (!fs.existsSync(schemasDirectoryPath)) {
        res.status(404);
        res.end('Can\'t update current schema');
        return;
    }

    const params = req.params;
    const schemasFiles = fs.readdirSync(schemasDirectoryPath);
    let currentSchema: CloudSchemaType | undefined;
    let currentSchemaFileName: string | undefined;
    let prevCurrentSchema: CloudSchemaType | undefined;
    let prevCurrentSchemaFileName: string | undefined;

    for (const file of schemasFiles) {
        const filePath = `${schemasDirectoryPath}/${file}`;
        const fileStats = fs.lstatSync(filePath);
        if (file.endsWith('.json') && !file.startsWith('current') && fileStats.isFile()) {
            const content = fs.readFileSync(filePath).toString();
            const schema = JSON.parse(content);

            if (schema.current === true) {
                prevCurrentSchema = schema;
                prevCurrentSchemaFileName = filePath;
            }
            if (schema.version === params.id) {
                currentSchema = schema;
                currentSchemaFileName = filePath;
            }
        }
    }

    if (currentSchemaFileName && currentSchema) {
        if (!schemaUtils.validateIntegrity(currentSchema.schema)) {
            res.status(406);
            res.end('Failed schema integrity check');
            return;
        }

        if (prevCurrentSchemaFileName && prevCurrentSchema) {
            fs.writeFileSync(prevCurrentSchemaFileName, JSON.stringify({
                ...prevCurrentSchema,
                current: false,
            }));
        }

        const data = JSON.stringify({
            ...currentSchema,
            current: true,
        });
        // update "current" schema memory cache
        encryptedSchemasCache.current = cryptoUtils.encrypt(data);
        fs.writeFileSync(currentSchemaFileName, data);
        fs.writeFileSync(`${schemasDirectoryPath}/current.json`, data);

        res.setHeader('content-type', 'application/json');
        res.end(data);
        return;
    }

    res.status(404);
    res.end('Can\'t update current schema');
}

export async function remove(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    const params = req.params;
    const schemaPath = path.resolve(schemasDirectoryPath, `${params.id}.json`);

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        res.end('Can\'t find schema with provided id');
        return;
    }

    const content = fs.readFileSync(schemaPath).toString();
    const schema = JSON.parse(content);

    if (schema.current === false) {
        fs.rmSync(schemaPath);
    }

    res.end(params.id);
}