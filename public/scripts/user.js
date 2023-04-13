import { auth, db, storage } from "../fire.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

const someBtn = document.getElementById("some-btn");
const formuser = document.getElementById("formUser");
const cont_pics = document.getElementById("pic-container");
const profileForm = document.getElementById("formUser");
const CheckBtn = document.getElementById("theCheck-btn");



console.log(profileForm["password"]);


let avatarsRef = ref(storage, 'stock-avatars/');
let imgSource;
const currentUser = auth.currentUser;
const userId = currentUser.uid;
let checkImage = false;

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

  CheckBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    console.log(checkImage);
  })

someBtn.addEventListener("click", async(e)=>{
    e.preventDefault();
    changePassword();

    let avatarUrl = null;
    let avatarRef = null; 
    let userAvatar = null;
    const querySnapshot = await getDoc(doc(db, "users", userId));
    const fireUser = querySnapshot.data();
    if(checkImage) {
      avatarRef = ref(storage, `avatars/${userId}.jpg`);
      avatarUrl = imgSource;
      const response = await fetch(avatarUrl);
      const blob = await response.blob();
      await uploadBytes(avatarRef, blob);
      userAvatar = await getDownloadURL(avatarRef);
    } else { 
      userAvatar = fireUser.Avatart;
      // avatarRef = ref(storage, `avatars/default.png`);
      // userAvatar = await getDownloadURL(avatarRef);
    }
    

      const type = "EmailAndPassword";
      const newname = profileForm["name"].value;
      const newemail = profileForm["email"].value;
      const newfullname = profileForm["fullname"].value;
      const newpassword = profileForm["password"].value;

      setDoc(doc(db, "users", userId), {
        Type: type,
        Name: newname,
        fullName: newfullname,
        Email: newemail,
        Avatart: userAvatar,
        Password: newpassword,
      });


})
async function changePassword() {
    let name = document.getElementById("name");
    let fullname = document.getElementById("fullname");
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    const querySnapshot = await getDoc(doc(db, "users", userId));
    const fireUser = querySnapshot.data();
    const Name = fireUser.Name;
    const Fullname = fireUser.fullName;
    const Email = fireUser.Email;
    const Password = fireUser.Password;
    name.value = Name;
    fullname.value = Fullname;
    email.value = Email;
    password.value = Password;
}
changePassword()

const getImg = async (event) => {
  const imgElements = cont_pics.querySelectorAll("img");
  checkImage = true;
    imgElements.forEach((imgElement) => {
      imgElement.removeAttribute("style");
      imgElement.className = "";
    });
    const imgElement = event.currentTarget;
    imgElement.style.border = "2px solid green";
    const imgSrc = imgElement.getAttribute("src");
    imgSource = imgSrc;
    return imgSource, checkImage;
}
