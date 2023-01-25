import { Request, Response } from 'express';
import { firebaseController } from 'src/controllers';

export async function isAuthorized(req: Request, res: Response) {
    const authToken = req.headers['authorization']?.toString();
    let isAuthorized = false;

    if (authToken) {
        try {
            isAuthorized = await firebaseController.isTokenValid(authToken);
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