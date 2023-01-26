import { Request, Response } from 'express';
import { firebaseController } from '../controllers';

export async function isAuthorized(req: Request, res: Response) {
    const authToken = req.headers['authorization']?.toString();
    let isAuthorized = false;

    if (authToken) {
        try {
            isAuthorized = await firebaseController.isAdmin(authToken);
        } catch (err) {
            //
        }
    }

    if (!isAuthorized) {
        res.status(403);
        res.end('Unauthorized');
    }

    return isAuthorized;
}