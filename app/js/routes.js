import MainPage from "./views/pages/mainPage.js";
import Login from "./views/pages/login.js";
import Register from "./views/pages/register.js";
import Create from "./views/pages/create.js";

export const routes = [
    {
        path: '/',
        page: MainPage,
    },
    {
        path: '/create',
        page: Create,
    },
    {
        path: '/login',
        page: Login,
    },
    {
        path: '/register',
        page: Register,
    }
];

export default routes;