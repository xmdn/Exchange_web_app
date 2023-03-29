import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { initializeCalculate } from './scripts/calculate.js';
import { initialize } from './scripts/listing.js';
const firebaseApp = initializeApp({  //FireBase csonfiguration of application
    apiKey: "AIzaSyAci7cExKpy7KdcaKtV-NynPs3kNWOUegA",
    authDomain: "currency-f1988.firebaseapp.com",
    databaseURL: "https://currency-f1988-default-rtdb.firebaseio.com",
    projectId: "currency-f1988",
    storageBucket: "currency-f1988.appspot.com",
    messagingSenderId: "1009009054053",
    appId: "1:1009009054053:web:3df8a1eef37bac6a70d18c"
  });
const auth = getAuth(firebaseApp);
const checkAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, user => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });
  };


  
const route = async (event) => {
    event = event || window.event;
    event.preventDefault();
    const path = event.currentTarget.href;
    const isAuthenticated = await checkAuth();
    if (path.endsWith('/calculate') && !isAuthenticated) {
        window.location.href = '/';
    } else {
        window.history.pushState({}, "", path);
        handleLocation();
    }
};

const scriptMap = {
    "/calculate": "calculate.js",
    "/add_user": "add_user.js",
    "/": "listing.js",
    "/login": "login.js",
  };
  
const routes = {
    404: "/pages/404.html",
    "/": "/pages/listing.html",
    "/calculate": "/pages/calculate.html",
    "/add_user": "/pages/add_user.html",
    "/login": "/pages/login.html"
};
// if (path && ) {

// }
// const path = window.location.pathname;

// console.log(scriptMap[path])


// const routes = {
//   404: ["/pages/404.html", null],
//   "/": ["/pages/listing.html", "/scripts/listing.js"],
//   "/calculate": ["/pages/calculate.html", "/scripts/calculate.js"],
//   "/add_user": ["/pages/add_user.html", "/scripts/add_user.js"],
//   "/login": ["/pages/login.html", "/scripts/login.js"]
// }
const handleLocation = async () => {
   
    //  const checkPath = async (path) => {
    //   for (const key of Object.keys(routes)) {
    //     if (path.endsWith(key)) {
    //       //return true;
    //       console.log("Buba :)");
    //       console.log(path);
    //     } else {
    //       console.log("maybe Buba :|")
    //       console.log(key);
    //     }
    //   }
    //   // return false;
    //   console.log("not Buba :(")
    //   console.log(key);
    // };
    //  const path = window.location.pathname;
    //  //console.log(path);
    //  checkPath(path);
    
    // if (checkPath(path)) {
    //   // Do something if path ends with any of the keys from routes
    //   console.log("Buba :)");
    // } else {
    //   // Do something else if path doesn't match any key from routes
    //   console.log("not Buba :(")
    // }
    // if (path === routes[path]){

    // }
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;

    const scriptFile = scriptMap[path]; 
    // const scriptFile = route[1]
    if (scriptFile) {
        const script = document.createElement("script");
        script.src = `./scripts/${scriptFile}`;
        script.type = "module";
        document.body.appendChild(script);
    } else {
    const script = document.createElement("script");
        script.src = "./router.js";
        script.type = "module";
        document.body.appendChild(script);
    }
    if(path === "/") {
          await initialize();
      }
    if(path === "/calculate") {
          await initializeCalculate();
    }
    
      // else if (path === "/calculate") {
      //     await initializeCalc();
      // }
};
// const routePaths = Object.keys(routes);
 const path = window.location.pathname;


// if (path === routes[path]) {
//   console.log("Buba :)");
// } else {
//   console.log("not Buba :(")
// }
// console.log(routePaths)


window.onpopstate = handleLocation;
window.route = route;

handleLocation();
