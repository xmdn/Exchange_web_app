// import {
//   hideLoginError,
//   showLoginState,
//   showLogininForm,
//   showApp,
//   showLoginError,
//   btnLogin,
//   btnSingup,
//   btnLogout,
//   txtPassword
// } from 'ui';
import { initializeApp } from 'firebase/app'; //Import FireBase
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
//import { collection, getfirestore } from 'firebase/firestore';

const firebaseApp = initializeApp({  //FireBase configuration of application
  apiKey: "AIzaSyAci7cExKpy7KdcaKtV-NynPs3kNWOUegA",
  authDomain: "currency-f1988.firebaseapp.com",
  projectId: "currency-f1988",
  storageBucket: "currency-f1988.appspot.com",
  messagingSenderId: "1009009054053",
  appId: "1:1009009054053:web:3df8a1eef37bac6a70d18c"
});

const auth = getAuth(firebaseApp);
//const db = firebaseApp.auth();

const user = auth.currentUser;
const register = () => {
  const email = document.getElementById('Email').value;
  const password = document.getElementById('Password').value;
  console.log(email, password);
  auth.createUserWithEmailAndPassword(email, password)
  .then((res) => {
    console.log(res.user)
  })
  .catch((err) => {
    console.log(err.code)
    console.log(err.message)
  })
}
  // if (user !== null) {
  //   const email = document.createElement('#email');
  //   const password = document.createElement('#password');
  //   //const ok = document.createElement('ok');
  //   email.innerHTML = email.txt;
  //   password.innerHTML = password.txt;
  //   email.user.appendChild(email);
  //   password.appendChild(password);
  // }

    
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     // const email = document.createElement('email');
//     // const password = document.createElement('password');
    
//       const user = userCredential.user;
//     })
    // ...
  
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // ..
  // })


//const db = getfirestore(app);
//db.collection('todos').hetDocs();
//const todosCol = collection(db, 'todos');
//const snapshot = await getDocs(todosCol);

//auth.onAuthStateChanged(user => {

//});
onAuthStateChanged(auth, user => {
  if(user != null) {
    console.log('loged');
  } else {
    console.log('no user');
  }
})

fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=20200302&json') // Get the API Endpoint
  .then(response => response.json())
  .then(data => {
    // Отображаем полученные данные в dropdown
    const currencyDropdown = document.querySelector('#currency');
    data.forEach(currency => {
      const option = document.createElement('option');
      option.value = currency.rate.toFixed(1);
      option.innerHTML = currency.cc;
      currencyDropdown.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
