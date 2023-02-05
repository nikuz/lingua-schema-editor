import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const hashMethod = 'sha256';
const numKeyBytes = 32;
const secret = normalizeSecret(process.env.CRYPTO_SECRET);
const iv = crypto.randomBytes(16);

function normalizeSecret(secret?: string): string | undefined {
    if (secret) {
        return crypto.createHash(hashMethod).update(String(secret)).digest('base64').substring(0, numKeyBytes);
    }

    return undefined;
}

// ----------------
// public methods
// ----------------

export function encrypt(text: string): string {
    if (!secret) {
        throw new Error('Can\'t encrypt text. Secret doesn\'t exist');
    }

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}.${encrypted.toString('hex')}`;
}

export function decrypt(text: string): string {
    if (!secret) {
        throw new Error('Can\'t decrypt text. Secret doesn\'t exist');
    }

    const textSplit = text.split('.');

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret), Buffer.from(textSplit[0], 'hex'));
    const decrypted = decipher.update(Buffer.from(textSplit[1], 'hex'));

    return Buffer.concat([decrypted, decipher.final()]).toString();
}