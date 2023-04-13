import { auth, db, storage } from "../fire.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  doc,
  setDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

const signupForm = document.getElementById("signup-form"); //Create user
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = signupForm["name"].value;
  const fullname = signupForm["fullname"].value;
  const email = signupForm["email"].value;
  const password = signupForm["password"].value;
  const avatarRef = ref(storage, `avatars/default.png`);
  const type = "EmailAndPassword";
  const userAvatar = await getDownloadURL(avatarRef);

  //const default_avatar = "./icons/default.png"; 
  console.log(email, password);
  createUserWithEmailAndPassword(auth, email, password).then((cred) => {
    return setDoc(doc(db, "users", cred.user.uid), {
      Type: type,
      Name: name,
      fullName: fullname,
      Email: email,
      Avatart: userAvatar,
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
