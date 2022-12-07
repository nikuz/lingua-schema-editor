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
import {
    useCollectionData,
    useDocumentData,
    useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import config from 'src/firebase-config.json';

export const firebaseApp = initializeApp(config);
export const authInstance = getAuth(firebaseApp);
export const firestoreInstance = getFirestore(firebaseApp);

export {
    signInWithEmailAndPassword,
    signOut,
    collection as firestoreCollection,
    useCollectionData as useFirestoreCollectionData,
    useDocumentData as useFirestoreDocumentData,
    useDocumentDataOnce as useFirestoreDocumentDataOnce,
    doc as firestoreDoc,
    setDoc as firestoreSetDoc,
    where as firestoreWhere,
    query as firestoreQuery,
    getDoc as firestoreGetDoc,
    getDocs as firestoreGetDocs,
    deleteDoc as firestoreDeleteDoc,
};