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
  const dropMenu = document.getElementById("dropdown-menu");
  const userName = document.getElementById("user-name");
  const firstItem = document.getElementById("first-menu-item");
  const secondItem = document.getElementById("second-menu-item");

onAuthStateChanged(auth, async (user) => {
//Check the login state
    // console.log(querySnapshot.data());
     console.log(user);
    if (user != null) {
        //firstItem.href = "/user";
        firstItem.href = "/login";
        //fistItem.onclick = "route()";
        firstItem.textContent = "Profile"
        secondItem.href = "/add_user";
        //secondItem.onclick = "route()";
        secondItem.textContent = "Sign Out"
        const currentId = user.uid;
        const querySnapshot = await getDoc(doc(db, "users", currentId));
        const fireUser = querySnapshot.data();
        console.log("loged");
        console.log(fireUser);
        const userPic = fireUser.Avatart;
        const Name = fireUser.Name;
        userImage.src = userPic;
        userName.textContent = Name;
        //const userName = user.displayName.split(' ')[0];
        //console.log(firstName);
        
    } else {
        firstItem.href = "/login";
        firstItem.textContent = "Log In"
        secondItem.href = "/add_user";
        secondItem.textContent = "Sign In"
        console.log("no user");
        userImage.src = "./icons/no-user.png";
        userName.textContent = "No User";

        //userImage.src = 
    }
    
    userContainer.appendChild(userImage);
    dropMenu.insertBefore(userName, dropMenu.firstChild);
    
});