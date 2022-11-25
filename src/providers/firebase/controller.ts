import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import config from 'src/firebase-config.json';

export const firebaseApp = initializeApp(config);
export const authInstance = getAuth(firebaseApp);

export {
    signInWithEmailAndPassword,
    signOut,
};