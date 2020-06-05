import {Router} from "../../router.js"

let user;

let notAutorized = /*html*/`
                    <a href="javascript:void(0);" class="sign-in">Sign in</a>
                    <a href="javascript:void(0);" class="sign-up">Sign up</a>
                    `;

let authorized = (userName) => {
    let view = /*html*/`
                <p id="username" class="username">${userName}</p>
                <a href="javascript:void(0);" class="sign-out">Log out</a>
                `;
    return view;
}

let addWord = /*html*/`
            <a href="javascript:void(0);" class="create-word">Create Word</a>
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
                        <nav class="left">
                            <a href="javascript:void(0);" class="label" id="home-label">MyDictionary</a>    
                            <div class="hide">
                                ${user ? addWord : ``}
                            </div>
                        </nav>
                        <nav class="right">
                            <div class="hide">
                                ${user ? autorized_view : notAutorized}
                            </div>                            
                        </nav>
                        <nav class="menu-bar right">
                            <a href="javascript:void(0);" id="burger" class="menu-bar">
                                <img src="./images/bars-solid.svg" class="burger" alt="">
                            </a>
                        </nav>
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