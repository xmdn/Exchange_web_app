import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"; //Imports of FireBase
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


const firebaseApp = initializeApp({

  apiKey: "AIzaSyAci7cExKpy7KdcaKtV-NynPs3kNWOUegA",
  authDomain: "currency-f1988.firebaseapp.com",
  databaseURL: "https://currency-f1988-default-rtdb.firebaseio.com",
  projectId: "currency-f1988",
  storageBucket: "currency-f1988.appspot.com",
  messagingSenderId: "1009009054053",
  appId: "1:1009009054053:web:3df8a1eef37bac6a70d18c",
});

const auth = getAuth(firebaseApp); //Get auth
const db = getFirestore(firebaseApp); //Get DataBase
const currentId = auth.currentUser;


const userForm = document.getElementById("user-form"); 
const getButton = document.getElementById("getBtn");
console.log(currentId.uid);
getButton.addEventListener("click", async () => {
  const querySnapshot = await getDocs(collection(db, "users", currentId.uid, "history"));
  
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().Amount}`);
    const outInfo = document.createElement("div");
    outInfo.name = "hist";
    outInfo.id = "hist";
    outInfo.textContent = `Amount: ${doc.data().Amount}  Result: ${doc.data().Result}`
    userForm.appendChild(outInfo);
  });
})

