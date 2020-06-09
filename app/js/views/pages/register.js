import Router from "../../router.js";

let Register = {
    render: async() => {
        let view = /*HTML*/`
                    <div class="register-card">
                        <h1 class="login-h1">Sign up</h1>
                        <div class="login-form-container">
                            <form class="login-form" name="sign-up-form">
                                <input type="text" class="login-input" placeholder="Login" name="login" id="login">
                                <input type="password" class="login-input" placeholder="Password" name="pswd" id="pswd">
                                <input type="password" class="login-input" placeholder="Confiurm password" name="confiurm" id="confiurm">
                                <input type="submit" id="btn-submit" value="Sign up">
                            </form>
                        </div>
                    </div>  
                    `;
        return view;
    },
    after_render: async () => {
        let form = document.forms["sign-up-form"];
        let password = form.elements["pswd"];
        let confiurm = form.elements["confiurm"];
        password.addEventListener("keyup", () => {
            validate(password, confiurm)
        });
        confiurm.addEventListener("keyup", () => {
            validate(password, confiurm)
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let login_value = form.elements["login"].value;
            let password_value = password.value;            
            signUp(login_value, password_value);
        })
    }
}

const signUp= (email, password) => {
    const auth = firebase.auth();
    auth.createUserWithEmailAndPassword(email, password)
        .then(function(result) {
            localStorage.setItem('login', email);
            return result.user.updateProfile({
                displayName: email
            }).then(function() {                
                localStorage.setItem('uid', auth.currentUser.uid);
                console.log("uid: ", localStorage.getItem("uid"));
                Router._instance.navigate("/");
            })
        }).catch(function(error) {
            localStorage.removeItem('login');
            localStorage.removeItem('uid');
            console.log(error);
        });
}

const validate = (password, confirm_password) => {
    if(password.value !== confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
    } else {
        confirm_password.setCustomValidity('');
    }
}

export default Register;