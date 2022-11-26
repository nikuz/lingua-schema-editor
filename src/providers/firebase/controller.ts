import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import config from 'src/firebase-config.json';

export const firebaseApp = initializeApp(config);
export const authInstance = getAuth(firebaseApp);
export const firestoreInstance = getFirestore(firebaseApp);

export {
    signInWithEmailAndPassword,
    signOut,
    collection as firestoreCollection,
    useCollectionData as useFirestoreCollectionData,
    doc as firestoreDoc,
    setDoc as setFirestoreDoc,
    where as firestoreWhere,
    query as firestoreQuery,
    getDocs as firestoreGetDocs,
};