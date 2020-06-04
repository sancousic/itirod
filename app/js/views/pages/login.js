import Router from "../../router.js";

let Login = {
    render: async() => {
        let view = /*HTML*/`
                    <div class="card">
                        <h1>Sign in</h1>
                        <div class="form-container">
                            <form name="sign-in-form">
                                <input type="text" placeholder="Login" name="login" id="login">
                                <input type="password" placeholder="Password" name="pswd" id="pswd">
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
        Router._instance.navigate("/");
    })
    .catch(e => {
        alert(e);
    });
}

export default Login;