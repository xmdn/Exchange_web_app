import { auth, db, storage } from "../fire.js";
import {
    onAuthStateChanged,
  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
    getDoc,
    doc,
  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


  const userContainer = document.getElementById("user-box");
  const userImage = document.getElementById("user-pic");
  const userBox = document.getElementById("dropdown-box");
  const userName = document.getElementById("user-name");
  

onAuthStateChanged(auth, async (user) => {
//Check the login state

    // console.log(querySnapshot.data());
    // console.log(user);
    if (user != null) {
        const currentId = user.uid;
        const querySnapshot = await getDoc(doc(db, "users", currentId));
        const fireUser = querySnapshot.data();
        console.log("loged");
        const userPic = fireUser.Avatart;
        userImage.src = userPic;

        userName.textContent = user.displayName;
        userContainer.appendChild(userImage);
        userContainer.appendChild(userName);
        
    } else {
        console.log("no user");
        userImage.src = "./icons/no-user.png";

        userName.textContent = "No User";
        userContainer.appendChild(userImage);
        userContainer.appendChild(userName);
        //userImage.src = 

    }
});