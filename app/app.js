import {Router} from "./js/router.js"
import {routes} from "./js/routes.js"

document.addEventListener("DOMContentLoaded", () => {
    Router.init(routes);
});

firebase.database.enableLogging(function(message) {
    console.log("[FIREBASE]", message);
});

