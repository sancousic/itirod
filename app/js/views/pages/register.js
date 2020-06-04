import Router from "../../router.js";

let Register = {
    render: async() => {
        let view = /*HTML*/`
                    <div class="card">
                        <h1>Sign up</h1>
                        <div class="form-container">
                            <form name="sign-up-form">
                                <input type="text" placeholder="Login" name="login" id="login">
                                <input type="password" placeholder="Password" name="pswd" id="pswd">
                                <input type="password" placeholder="Confiurm password" name="confiurm" id="confiurm">
                                <input type="submit" id="btn-submit" value="Sign in">
                            </form>
                            <div>
                                <p id="validate"></p>
                            </div>
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
            let login_value = form.elements["login"].value;
            let password_value = password.value;
            e.preventDefault();
            signUp(login_value, password_value);
        })
    }
}

const auth = firebase.auth();

const signUp= (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(result) {
            return result.user.updateProfile({
                displayName: email
            }).then(function() {
                localStorage.setItem('login', email);
                Router._instance.navigate("/");
            })
        }).catch(function(error) {
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