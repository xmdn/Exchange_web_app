import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'; //Imports of FireBase
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
//import { initializeApp } from 'firebase/app'; //Imports of FireBase
//import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
//import { getFirestore, addDoc, collection } from 'firebase/firestore';

const firebaseApp = initializeApp({  //FireBase configuration of application
  apiKey: "AIzaSyAci7cExKpy7KdcaKtV-NynPs3kNWOUegA",
  authDomain: "currency-f1988.firebaseapp.com",
  databaseURL: "https://currency-f1988-default-rtdb.firebaseio.com",
  projectId: "currency-f1988",
  storageBucket: "currency-f1988.appspot.com",
  messagingSenderId: "1009009054053",
  appId: "1:1009009054053:web:3df8a1eef37bac6a70d18c"
});

const auth = getAuth(firebaseApp); //Get auth
const db = getFirestore(); //Get DataBase
   //return collection(db, 'users').doc(cred.user.uid).set({

const signupForm = document.getElementById("signup-form"); //Create user
signupForm.addEventListener('usr-add', e => {
  e.preventDefault();
  const name = signupForm["name"].value;
  const email = signupForm["email"].value;
  const password = signupForm["password"].value;
  console.log(email, password);
  createUserWithEmailAndPassword(auth, email, password).then(cred=>{
    return setDoc(doc(db, 'users', cred.user.uid), {
      Name: name,
      Email: email,
      Password: password
    }).then(()=>{
      console.log('success');
    }).catch(error=>{
       console.log('Error:', error);
     })
  })
})

onAuthStateChanged(auth, user => { //Check the login state
  if(user != null) {
    console.log('loged');
  } else {
    console.log('no user');
  }
})