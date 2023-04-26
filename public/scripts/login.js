import { auth, db, storage } from "../fire.js";
import { resolveUserId } from "../router.js";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  collection,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

//export async function initializeLogin() {

const logout_btn = document.getElementById("logout-btn");
const messageElement = document.getElementById("message");
const signupForm = document.getElementById("login-form");
const googleBtn = document.getElementById("googleAuth");
const facebookBtn = document.getElementById("faceAuth");
const mainContainer = document.getElementById("main-page");
const subBtn = document.getElementById("submit-btn");

let userState = null;



signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm["email"].value;
  const password = signupForm["password"].value;
  console.log(email, password);
  onAuthStateChanged(auth, (user) => {
    //Check the login state
    if (user === null) {
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
googleBtn.addEventListener("click", ()=> {
  signinPopup('google');
})
facebookBtn.addEventListener("click", ()=> {
  signinPopup('facebook');
})

function signinPopup(provider) {
  let authProvider;
  if (provider === 'google') {
    authProvider = new GoogleAuthProvider();
  } else if (provider === 'facebook') {
    authProvider = new FacebookAuthProvider();
  }
  signInWithPopup(auth, authProvider)
  .then(async (result) => {

    const user = result.user;
    const userId = user.uid;
    const avatarRef = ref(storage, `avatars/${userId}.jpg`);

    const avatarUrl = user.photoURL;
    const response = await fetch(avatarUrl);
    const userName = user.displayName.split(' ')[0];
    const blob = await response.blob();
    await uploadBytes(avatarRef, blob)
    const userAvatar = await getDownloadURL(avatarRef);

    setDoc(doc(db, "users", userId), {
      Type: result.providerId,
      Name: userName,
      fullName: user.displayName,
      Email: user.email,
      Avatart: userAvatar,
    })
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    //const user = result.user;
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

}

function showMessage(message) {
  //Message showing
  messageElement.textContent = message;
}

logout_btn.addEventListener("click", (e) => {
  e.preventDefault();
  signOut()
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
    userState = true;
  } else {
    showMessage("Not loged");
    userState = false;
  }
});
