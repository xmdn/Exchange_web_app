import { auth, db, storage } from "../fire.js";
import {
    onAuthStateChanged,
  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";


  const userContainer = document.getElementById("user-box");
  const userImage = document.getElementById("user-pic");
  const userBox = document.getElementById("dropdown-box");
  

onAuthStateChanged(auth, (user) => {
//Check the login state
    console.log(user);
    if (user != null) {
        console.log("loged");
        const userPic = user.photoURL;
        userImage.src = userPic;

        userContainer.textContent = user.displayName;
        userContainer.appendChild(userImage);
        userBox.appendChild(userContainer);
        
    } else {
        console.log("no user");
        //userImage.src = 

    }
});