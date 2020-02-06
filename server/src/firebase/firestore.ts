const admin = require('firebase-admin');

let serviceAccount = require('../../files/serviceRoleKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://my-goty-app-a4e1e.firebaseio.com'
});

let db = admin.firestore();
let firestore = admin.firestore;

module.exports = { db, firestore, admin };
