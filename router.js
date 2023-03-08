const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation()
};
const styleMap = {
    "/calculate": "calculate.css",
    "/add_user": "add_user.css",
    "/": "login.css",
}
const scriptMap = {
    "/calculate": "calculate.js",
    "/add_user": "add_user.js",
    "/": "login.js",
  };
  
const routes = {
    404: "/pages/404.html",
    "/": "/pages/login.html",
    "/calculate": "/pages/calculate.html",
    "/add_user": "/pages/add_user.html"
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
    }
    const styleFile = styleMap[path];
    if (styleFile) {
        const style = document.createElement("link");
        style.href = `styles/${styleFile}`;
        style.rel = "stylesheet";
        style.type = "text/css";
        document.body.appendChild(style);
    }
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();