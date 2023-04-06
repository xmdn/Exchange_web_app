import { auth, db } from "../fire.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const signupForm = document.getElementById("signup-form"); //Create user
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = signupForm["name"].value;
  const email = signupForm["email"].value;
  const password = signupForm["password"].value;
  console.log(email, password);
  createUserWithEmailAndPassword(auth, email, password).then((cred) => {
    return setDoc(doc(db, "users", cred.user.uid), {
      Name: name,
      Email: email,
      Password: password,
    })
      .then(() => {
        console.log("success");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });
});

onAuthStateChanged(auth, (user) => {
  //Check the login state
  if (user != null) {
    console.log("loged");
  } else {
    console.log("no user");
  }
});
