import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import config from 'src/wisual-web-firebase.json';

export const firebaseApp = initializeApp(config);
export const authInstance = getAuth(firebaseApp);

export {
    signInWithEmailAndPassword,
    signOut,
};