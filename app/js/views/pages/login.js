import Router from "../../router.js";

let Login = {
    render: async() => {
        let view = /*HTML*/`
                    <div class="login-card">
                        <h1 class="login-h1">Sign in</h1>
                        <div class="login-form-container">
                            <form name="sign-in-form" class="login-form">
                                <input type="text" class="login-input" placeholder="Login" name="login" id="login">
                                <input type="password" class="login-input" placeholder="Password" name="pswd" id="pswd">
                                <input type="submit" id="btn-submit" value="Sign in">
                            </form>
                        </div>  
                        <div class="row">
                            <p class="not-reg">Not registered?</p>
                            <a class="reg" href="#register">Create an account!</a>
                        </div>
                    </div>  
                    `;
        return view;
    },
    after_render: async () => {
        let form = document.forms["sign-in-form"];
        form.addEventListener("submit", (e) => {
            let mail = form.elements['login'].value;
            let pswd = form.elements['pswd'].value;
            e.preventDefault();
            signIn(mail, pswd);
        });
    }
}

const auth = firebase.auth();

const signIn = (email, password) => {
    auth.signInWithEmailAndPassword(email, password).then(() => {
        localStorage.setItem("login", email);
        Router._instance.navigate("/");
    })
    .catch(e => {
        alert(e);
    });
}

export default Login;