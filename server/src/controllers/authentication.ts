import { Request, Response } from 'express';
import * as firebaseAdmin from 'firebase-admin';
import serviceAccount from '../wisual-firebase.json';

const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
    }),
});

export async function isAdmin(token: string) {
    return new Promise<boolean>((resolve, reject) => {
        firebaseApp.auth().verifyIdToken(token).then((decodedToken) => {
            const expirationTime = new Date(decodedToken.exp * 1000);
            if (decodedToken.uid === process.env.ADMIN_USER_ID && new Date() < expirationTime) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(reject);
    });
}

export async function isAuthorized(req: Request) {
    const authToken = req.headers['authorization']?.toString();
    let isAuthorized = false;

    if (authToken) {
        try {
            isAuthorized = await isAdmin(authToken);
        } catch (err) {
            //
        }
    }

    return isAuthorized;
}

export async function respondUnauthorized(res: Response) {
    res.status(403);
    res.end('Unauthorized');
}