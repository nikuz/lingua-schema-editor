import * as firebaseAdmin from 'firebase-admin';
import serviceAccount from '../../wisual-firebase.json';

const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
    }),
});

export async function isTokenValid(token: string) {
    return new Promise<boolean>((resolve, reject) => {
        firebaseApp.auth().verifyIdToken(token).then((decodedToken) => {
            if (decodedToken && decodedToken.uid) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(reject);
    });
}