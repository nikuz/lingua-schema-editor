import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { authenticationController } from '../controllers';
import { schemaUtils, cryptoUtils } from '../utils';
import {
    CloudSchemaType,
    ObjectDataString,
} from '../types';

const encryptedSchemasCache: ObjectDataString = {};
const schemasDirectoryPath = path.resolve(process.env.STATIC_FILES_DIRECTORY ?? '', 'schemas');

export async function getList(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    if (!fs.existsSync(schemasDirectoryPath)) {
        return res.end('[]');
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
    return res.end(JSON.stringify(schemas));
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
        return res.end('Schema with provided ID already exists');
    }

    const data = JSON.stringify(body);
    fs.writeFileSync(filePath, data);

    encryptedSchemasCache[body.version] = cryptoUtils.encrypt(data);

    res.setHeader('content-type', 'application/json');
    return res.end(data);
}

export async function update(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    const params = req.params;
    const schemaPath = path.resolve(schemasDirectoryPath, `${params.id}.json`);

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        return res.end('Can\'t find schema with provided id');
    }

    const body: CloudSchemaType = req.body;

    if (body.current && !schemaUtils.validateIntegrity(body.schema)) {
        res.status(406);
        return res.end('Failed schema integrity check');
    }

    const data = JSON.stringify(body);
    fs.writeFileSync(schemaPath, data);

    if (body.current) {
        fs.writeFileSync(path.resolve(schemasDirectoryPath, 'current.json'), data);
    }

    encryptedSchemasCache[body.version] = cryptoUtils.encrypt(data);

    res.setHeader('content-type', 'application/json');
    return res.end(data);
}

export async function get(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    const params = req.params;
    const schemaPath = path.resolve(schemasDirectoryPath, `${params.id}.json`);

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        return res.end('Can\'t find schema with provided id');
    }

    res.setHeader('content-type', 'application/json');
    res.end(fs.readFileSync(schemaPath));
}

export function getEncrypted(req: Request, res: Response) {
    const params = req.params;
    const schemaPath = path.resolve(schemasDirectoryPath, `${params.id}.json`);

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        return res.end('Can\'t find schema with provided id');
    }

    // take "current" schema from memory cache if available
    let data;
    if (encryptedSchemasCache[params.id]) {
        data = encryptedSchemasCache[params.id];
    } else {
        data = cryptoUtils.encrypt(fs.readFileSync(schemaPath).toString());
        encryptedSchemasCache[params.id] = data;
    }

    return res.end(data);
}

export async function setCurrent(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    if (!fs.existsSync(schemasDirectoryPath)) {
        res.status(404);
        return res.end('Can\'t update current schema');
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
            return res.end('Failed schema integrity check');
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
        return res.end(data);
    }

    res.status(404);
    return res.end('Can\'t update current schema');
}

export async function remove(req: Request, res: Response) {
    if (!(await authenticationController.isAuthorized(req))) {
        return authenticationController.respondUnauthorized(res);
    }

    const params = req.params;
    const schemaPath = path.resolve(schemasDirectoryPath, `${params.id}.json`);

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        return res.end('Can\'t find schema with provided id');
    }

    const content = fs.readFileSync(schemaPath).toString();
    const schema = JSON.parse(content);

    if (schema.current === false) {
        fs.rmSync(schemaPath);
    }

    return res.end(params.id);
}