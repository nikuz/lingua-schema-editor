import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    query,
    where,
    getDoc,
    getDocs,
    deleteDoc,
} from 'firebase/firestore';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import config from 'src/wisual-web-firebase.json';

export const firebaseApp = initializeApp(config);
export const authInstance = getAuth(firebaseApp);
export const firestoreInstance = getFirestore(firebaseApp);

export {
    signInWithEmailAndPassword,
    signOut,
    collection as firestoreCollection,
    doc as firestoreDoc,
    setDoc as firestoreSetDoc,
    where as firestoreWhere,
    query as firestoreQuery,
    getDoc as firestoreGetDoc,
    getDocs as firestoreGetDocs,
    deleteDoc as firestoreDeleteDoc,
};