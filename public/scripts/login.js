import { auth } from "../fire.js";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const logout_btn = document.getElementById("logout-btn");
const messageElement = document.getElementById("message");
const signupForm = document.getElementById("login-form");
const googleBtn = document.getElementById("googleAuth");
const facebookBtn = document.getElementById("faceAuth");

const providerG = new GoogleAuthProvider();
const providerF = new FacebookAuthProvider();

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm["email"].value;
  const password = signupForm["password"].value;
  console.log(email, password);
  onAuthStateChanged(auth, (user) => {
    //Check the login state
    if (user == null) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          showMessage("Success loging.");
        })
        .catch(() => {
          showMessage("Incorrect loging.");
        });
    } else {
      showMessage("Already loged.");
    }
  });
});
googleBtn.addEventListener("click", () => {
  signInWithPopup(auth, providerG)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
})

facebookBtn.addEventListener("click", () => {
  signInWithPopup(auth, providerF)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
})



function showMessage(message) {
  //Message showing
  messageElement.textContent = message;
}

logout_btn.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      showMessage("Sign-out successful."); // Sign-out successful.
    })
    .catch((error) => {
      showMessage("An error happened."); // An error happened.
    });
});

onAuthStateChanged(auth, (user) => {
  //Check the login state
  if (user != null) {
    showMessage("Loged On");
  } else {
    showMessage("Not loged");
  }
});
