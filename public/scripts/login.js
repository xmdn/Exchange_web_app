import { auth } from "../fire.js";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const logout_btn = document.getElementById("logout-btn");
const signupForm = document.getElementById("login-form"); //Create user
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

const messageElement = document.getElementById("message"); //Message Form
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
