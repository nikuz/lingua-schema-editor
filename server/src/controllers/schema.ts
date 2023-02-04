import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { authUtils, schemaUtils } from '../utils';
import { ObjectData } from '../types';

let currentSchemaCache: string;
const schemasDirectoryPath = path.resolve(process.env.STATIC_FILES_DIRECTORY ?? '', 'schemas');

export async function getList(req: Request, res: Response) {
    if (!(await authUtils.isAuthorized(req, res))) {
        return;
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

    return res.end(JSON.stringify(schemas));
}

export async function add(req: Request, res: Response) {
    if (!(await authUtils.isAuthorized(req, res))) {
        return;
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

    return res.end(data);
}

export async function update(req: Request, res: Response) {
    if (!(await authUtils.isAuthorized(req, res))) {
        return;
    }

    const params = req.params;
    const schemaPath = path.resolve(schemasDirectoryPath, `${params.id}.json`);

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        return res.end('Can\'t find schema with provided id');
    }

    const body = req.body;

    if (body.current && !schemaUtils.validateIntegrity(JSON.parse(body.schema))) {
        res.status(406);
        return res.end('Failed schema integrity check');
    }

    const data = JSON.stringify(body);
    fs.writeFileSync(schemaPath, data);

    if (body.current === true) {
        fs.writeFileSync(path.resolve(schemasDirectoryPath, 'current.json'), data);
        currentSchemaCache = data;
    }

    return res.end(data);
}

export async function get(req: Request, res: Response) {
    if (!(await authUtils.isAuthorized(req, res))) {
        return;
    }

    const params = req.params;
    const schemaPath = path.resolve(schemasDirectoryPath, `${params.id}.json`);

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        return res.end('Can\'t find schema with provided id');
    }

    return res.end(fs.readFileSync(schemaPath));
}

export function getCurrent(req: Request, res: Response) {
    const schemaPath = path.resolve(schemasDirectoryPath, 'current.json');

    if (!fs.existsSync(schemaPath)) {
        res.status(404);
        return res.end('Can\'t find "current" schema');
    }

    // take "current" schema from memory cache if available
    let data;
    if (currentSchemaCache) {
        data = currentSchemaCache;
    } else {
        data = fs.readFileSync(schemaPath).toString();
        currentSchemaCache = data;
    }

    return res.end(data);
}

export async function setCurrent(req: Request, res: Response) {
    if (!(await authUtils.isAuthorized(req, res))) {
        return;
    }

    if (!fs.existsSync(schemasDirectoryPath)) {
        res.status(404);
        return res.end('Can\'t update current schema');
    }

    const params = req.params;
    const schemasFiles = fs.readdirSync(schemasDirectoryPath);
    let currentSchema: ObjectData | undefined;
    let currentSchemaFileName: string | undefined;
    let prevCurrentSchema: ObjectData | undefined;
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
        if (!schemaUtils.validateIntegrity(JSON.parse(currentSchema.schema))) {
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
        currentSchemaCache = data;
        fs.writeFileSync(currentSchemaFileName, data);
        fs.writeFileSync(`${schemasDirectoryPath}/current.json`, data);

        return res.end(data);
    }

    res.status(404);
    return res.end('Can\'t update current schema');
}

export async function remove(req: Request, res: Response) {
    if (!(await authUtils.isAuthorized(req, res))) {
        return;
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