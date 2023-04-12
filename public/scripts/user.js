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
import { ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

const someBtn = document.getElementById("some-btn");
const formuser = document.getElementById("formUser");
const cont_pics = document.getElementById("pic-container");


let avatarsRef = ref(storage, 'stock-avatars/');
let imgSource;
const currentUser = auth.currentUser;

listAll(avatarsRef)
  .then((result) => {
    result.items.forEach((item) => {
      // Get the download URL for each file
      getDownloadURL(item).then((url) => {
        //const cont_pic = document.createElement("a");
        const newPic = document.createElement("img");
        newPic.src = url;
        newPic.onclick = getImg;
        cont_pics.appendChild(newPic);
        //cont_pics.appendChild(cont_pic);
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });


someBtn.addEventListener("click", async(e)=>{
    e.preventDefault();
    changePassword();

    //const user = result.user;
    const userId = currentUser.uid;
    const avatarRef = ref(storage, `avatars/${userId}.jpg`);
    const avatarUrl = imgSource;
    try {
        const response = await fetch(avatarUrl);
        const blob = await response.blob();
        await uploadBytes(avatarRef, blob);
        const userAvatar = await getDownloadURL(avatarRef);
        setDoc(doc(db, "users", userId), {
          Avatart: userAvatar,
        });
      } catch (error) {
        console.error(error);
      }

})
function changePassword() {
    const changes = document.createElement("div");
    changes.textContent = "💩💩💩shit happend!💩💩💩";
    formuser.appendChild(changes);
}

const getImg = async (event) => {
    const imgElement = event.currentTarget;
    const imgSrc = imgElement.getAttribute("src");
    imgSource = imgSrc;
    return imgSource;
}
