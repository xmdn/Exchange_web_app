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
  getDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
//import { initializeApp } from 'firebase/app'; //Imports of FireBase
//import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
//import { getFirestore, addDoc, collection } from 'firebase/firestore';

const firebaseApp = initializeApp({
  //FireBase configuration of application
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
//return collection(db, 'users').doc(cred.user.uid).set({

const userForm = document.getElementById("user-form"); //Create user

const docRef = db.collection("users");

userForm.addEventListener("submit", async () => {
    
  //setDoc(doc(db, "users", cred.user.uid)
    const docSnap = await getDocs(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    } 
//   e.preventDefault();
//   const name = signupForm["name"].value;
//   const email = signupForm["email"].value;
//   const password = signupForm["password"].value;
//   console.log(email, password);
//   createUserWithEmailAndPassword(auth, email, password).then((cred) => {
//     return setDoc(doc(db, "users", cred.user.uid), {
//       Name: name,
//       Email: email,
//       Password: password,
//     })
//       .then(() => {
//         console.log("success");
//       })
//       .catch((error) => {
//         console.log("Error:", error);
//       });
//   });
});
