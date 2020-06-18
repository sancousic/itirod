import Router from "../../router.js";
import WordOfDay from "../components/wordOfDay.js";
import Utils from "../../helper/util.js";
import Error404 from "./Error404.js";

let Details = {
    render: async() => {
        let view = /*HTML*/`
                    <div id="content" class="content">
                        <div>
                            <div class="h-container">   
                                <div class="h-box">
                                    <h1 class="standart">Word details</h1>
                                </div>                         
                            </div>
                            <div class="index-card-day" id="day-card">                                
                            </div>                        
                            <a href="https://mydictionary-320fb.web.app/" class="back" id="back-btn">Back</a>
                        </div>        
                    </div>  
                    `;
        return view;
    },
    after_render: async () => {
        let request = Utils.parseRequestURL();
        let word = await getWordById(request.id);

        if(!word) {
            await render404();
            return;
        }

        let back_btn = document.getElementById('back-btn');
        back_btn.addEventListener('click', function(e) {
            e.preventDefault();
            const destination = e.target.href;
            Router._instance.navigate(destination); 
        });
        let wordCart = document.getElementById("day-card");

        let wordView = await WordOfDay.render(word);
        wordCart.insertAdjacentHTML('beforeend', wordView);
        WordOfDay.after_render(word);
    }
}

const render404 = async function() {
    const content = document.getElementById("content");
    content.innerHTML = await Error404.render();

}

const getWordById = async function(Id) {
    let res;
    await firebase.database()
        .ref(`words/${Id}`)
        .once('value', function(snapshot) {
            if(snapshot.exists()) {
                res = snapshot.val();
                res.key = snapshot.key;
            } else {
                res = null;
            }
        });
    return res;
}

export default Details;