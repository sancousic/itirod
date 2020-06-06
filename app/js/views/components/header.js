import {Router} from "../../router.js"

let user;

let notAutorized = /*html*/`
                    <button class="ref sign-in">Sign in</button>
                    <button class="ref sign-up">Sign up</button>
                    `;

let authorized = (userName) => {
    let view = /*html*/`
                <p id="username" class="username">${userName}</p>
                <button class="ref sign-out">Log out</button>
                `;
    return view;
}

let addWord = /*html*/`
            <button class="ref create-word">Create Word</button>
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
                            <button class="ref label" id="home-label">MyDictionary</button>    
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
        if(!user) {
            var login_elements = document.getElementsByClassName("sign-in");
            var register_elements = document.getElementsByClassName("sign-up");
            for(let i = 0; i < login_elements.length; i++) {
                login_elements[i].addEventListener("click", () => {
                    Router._instance.navigate("/login");                   
                })
            }

            for(let i = 0; i < register_elements.length; i++) {
                register_elements[i].addEventListener("click", () => {
                    Router._instance.navigate("/register");
                })
            }
        }
        else {
            var logout_elements = document.getElementsByClassName("sign-out");
            var create_elements = document.getElementsByClassName("create-word");

            for(let i = 0; i < logout_elements.length; i++) {
                logout_elements[i].addEventListener("click", () => {
                    console.log("logout");
                    firebase.auth().signOut().then(() => {
                        localStorage.removeItem("login");
                        Router._instance.navigate("/");
                    });                    
                });
            }

            for(let i = 0; i < create_elements.length; i++) {
                create_elements[i].addEventListener("click", () => {
                    Router._instance.navigate("/create");
                });
            }
        }

        const label = document.getElementById("home-label");
        label.addEventListener("click", () => {
            Router._instance.navigate("/");
        });

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