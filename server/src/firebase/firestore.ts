import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL
  }),
  databaseURL: 'https://my-goty-app-a4e1e.firebaseio.com'
});

const db = admin.firestore();
const firestore = admin.firestore;
export { db, firestore, admin };
