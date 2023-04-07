import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
// import { initializeCalculate } from './scripts/calculate.js';
// import { initialize } from './scripts/listing.js';
const firebaseApp = initializeApp({  //FireBase csonfiguration of application
    apiKey: "AIzaSyAci7cExKpy7KdcaKtV-NynPs3kNWOUegA",
    authDomain: "currency-f1988.firebaseapp.com",
    databaseURL: "https://currency-f1988-default-rtdb.firebaseio.com",
    projectId: "currency-f1988",
    storageBucket: "currency-f1988.appspot.com",
    messagingSenderId: "1009009054053",
    appId: "1:1009009054053:web:3df8a1eef37bac6a70d18c",
  });

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };