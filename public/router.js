import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { initializeCalculate } from './scripts/calculate.js';
import { initialize } from './scripts/listing.js';
import { auth } from './fire.js';

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
    "/user": "user.js"
  };
  
const routes = {
    404: "/pages/404.html",
    "/": "/pages/listing.html",
    "/calculate": "/pages/calculate.html",
    "/add_user": "/pages/add_user.html",
    "/login": "/pages/login.html",
    "/user": "/pages/user.html"
};

const handleLocation = async () => {
   
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;

    const scriptFile = scriptMap[path]; 
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
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();