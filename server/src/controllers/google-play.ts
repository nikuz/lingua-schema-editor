import { Request, Response } from 'express';
import { auth, JWT } from 'google-auth-library';
import serviceAccount from '../wisual-play-console.json';

const PACKAGE_NAME = 'com.wisual.dictionary';
const PRODUCT_ID = 'full_access';

const client = auth.fromJSON(serviceAccount) as JWT;
client.scopes = ['https://www.googleapis.com/auth/androidpublisher'];

export async function verifyPurchase(req: Request, res: Response) {
    const token = req.query.token;
    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}/purchases/products/${PRODUCT_ID}/tokens/${token}`;

    client.request({ url }).then(googlePlayResponse => {
        console.log(googlePlayResponse);
        res.end(googlePlayResponse.data);
    }).catch((err) => {
        res.status(404);
        res.end(err.message);
    });
}