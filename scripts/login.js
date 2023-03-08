import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'; //Imports of FireBase
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
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

const logout_btn = document.getElementById("logout-btn");
const signupForm = document.getElementById("login-form"); //Create user
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = signupForm["name"].value;
  const email = signupForm["email"].value;
  const password = signupForm["password"].value;
  console.log(email, password);
  signInWithEmailAndPassword(auth, email, password).then(()=>{
    showMessage('Success loging.');
  }).catch(() => {
    showMessage('Incorrect loging.');
  })
})

const messageElement = document.getElementById('message'); //Message Form
function showMessage(message){  //Message showing
  messageElement.textContent = message;
}

function logout() {
  signOut(auth).then(() => {
    showMessage('Sign-out successful.');  // Sign-out successful.
  }).catch((error) => { 
    showMessage('An error happened.');  // An error happened.
  });
}
logout_btn.addEventListener('click', logout);

onAuthStateChanged(auth, user => { //Check the login state
  if(user != null) {
    showMessage('Loged On');
  } else {
    showMessage('Not loged');
  }
})
