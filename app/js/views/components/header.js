import {Router} from "../../router.js"

let user;

let notAutorized = /*html*/`
                    <a href="https://mydictionary-320fb.web.app/login" class="ref sign-in">Sign in</a>
                    <a href="https://mydictionary-320fb.web.app/register" class="ref sign-up">Sign up</a>
                    `;

let authorized = (userName) => {
    let view = /*html*/`
                <p id="username" class="username">${userName}</p>
                <a href="https://mydictionary-320fb.web.app/logout" class="sign-out">Log out</a>
                `;
    return view;
}

let addWord = /*html*/`
            <a href="https://mydictionary-320fb.web.app/create" class="ref create-word">Create Word</a>
            `;

let Header = {
    render : async () => {
        user = firebase.auth().currentUser
        let autorized_view;
        if(user) {
            autorized_view = authorized(localStorage.login ? localStorage.login : user.displayName);
        }
        let view = /*HTML*/`
                    <div class="header-container">
                        <nav>                            
                            <a href="https://mydictionary-320fb.web.app" class="ref label" id="home-label">MyDictionary</a>    
                            <div class="disappearing">
                                ${user ? addWord : ``}
                            </div>                            
                            <div class="right disappearing">                                
                                ${user ? autorized_view : notAutorized}
                            </div>
                        </nav>                        
                        <div class="menu-bar">                            
                            <img src="./images/bars-solid.svg" class="burger" id="burger" alt="">                            
                        </div>
                    </div>
                    <nav class="nav-bot" id="nav-bot">
                        ${user ? autorized_view : notAutorized}
                        ${user ? addWord : ``}
                    </nav>
                `;
        return view;
    },
    after_render: async () => {
        var ref_elements = document.getElementsByClassName("ref");

        for(let i = 0; i < ref_elements.length; i++) {
            ref_elements[i].addEventListener("click", (e) => {
                e.preventDefault();
                const destination = e.target.href;
                Router._instance.navigate(destination);                   
            })
        }
        
        if(user) {
            var logout_elements = document.getElementsByClassName("sign-out");

            for(let i = 0; i < logout_elements.length; i++) {
                logout_elements[i].addEventListener("click", (e) => {
                    console.log("logout");
                    e.preventDefault();
                    firebase.auth().signOut().then(() => {
                        localStorage.removeItem("login");
                        localStorage.removeItem("uid");
                        Router._instance.navigate("/");
                    });                    
                });
            }
        }

        const burger = document.getElementById("burger");
        burger.addEventListener("click", () => {
            var links = document.getElementById("nav-bot");
            if(links.classList.contains("nav-bot"))
            {
                links.classList.replace("nav-bot", "hide");
            }
            else {
                links.classList.replace("hide", "nav-bot");
            }
        });
    }
}

export default Header;