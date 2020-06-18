import Utils from "./helper/util.js";
import Header from "./views/components/header.js";
import Error404 from "./views/pages/Error404.js";

export class Router {
    static _instance = null;
    static currentPage = null;

    constructor(routes) {
        this.routes = routes;
        window.addEventListener('popstate', event => this._onPopState(event));
    }

    _onPopState() {
        if(Router.currentPage && Router.currentPage.onDestroy) {
            Router.currentPage.onDestroy();
        }
        this.loadPage(this.parseCurrentURL());
    }

    static init(routes) {
        if(Router._instance != null) {
            return Router._instance;
        }

        const path = window.location.pathname;
        window.history.replaceState({path}, path, path);
        const router = new Router(routes);
        Router._instance = router;
        router._loadInitial();
        firebase.auth().onAuthStateChanged(async () => {
            console.log("IT WORKS!!");            
            await router.render_header();
        });
        router.render_header();
        return router;
    }

    async render_header() {
        const header = null || document.getElementById("header-id");
        header.innerHTML = await Header.render();
        await Header.after_render();
    }

    navigate(url) {
        if (Router.currentPage && Router.currentPage.onDestroy){
            Router.currentPage.onDestroy();
        }

        history.pushState({}, "", url);

        let parseURL = this.parseCurrentURL()
        this.loadPage(parseURL)
    }

    async loadPage(url){
        const content = null || document.getElementById('main-box');

        Router.currentPage = Error404
        for (const { path, page} of Router._instance.routes) {
            if (path === url){
                Router.currentPage = page;
            }
        }
        content.innerHTML = await Router.currentPage.render();
        await Router.currentPage.after_render();
    }

    parseCurrentURL(){
        let request = Utils.parseRequestURL()
        let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')
        return parsedURL
    }

    async _loadInitial(){
        let url = window.location.pathname;
        this.navigate(url)
    }
}

export default Router;