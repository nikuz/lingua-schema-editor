import { Request, Response } from 'express';
import { firebaseController } from '../controllers';

export async function isAuthorized(req: Request) {
    const authToken = req.headers['authorization']?.toString();
    let isAuthorized = false;

    if (authToken) {
        try {
            isAuthorized = await firebaseController.isAdmin(authToken);
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