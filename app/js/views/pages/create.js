import Router from "../../router.js";

let Create = {
    render: async() => {
        let view = /*HTML*/`
                    <div class="content">
                        <div class="h-container">   
                            <div class="h-box">
                                <h1 class="standart">Create word</h1>
                            </div>                         
                        </div>
                        <div class="create-card">                
                            <form class="create-form" name="create-form">
                                <label class="create-label" for="word">Word</label>
                                <input type="text" class="create-input" placeholder="Input your word here" name="word" id="word">
                                <label for="def" class="create-label">Defenition</label>
                                <input type="text" class="create-input " placeholder="Input your word defenition here" name="def" id="def">
                                <label for="extra" class="create-label">Extra comments</label>
                                <textarea name="extra" class="create-textarea" placeholder="Input your extra comments here" id="extra"></textarea>
                                <label for="source" class="create-label">Sources</label>
                                <textarea name="source" class="create-textarea" placeholder="Input your sources" id="source"></textarea>                       
                                <input type="submit" class="create-input" value="Create">                                           
                            </form>
                    </div>  
                    </div>      
                    `;
        return view;
    },
    after_render: async () => {
        let form = document.forms["create-form"];

        let word_field = form.elements['word'];
        let def_field = form.elements['def'];

        set_validate(word_field);
        set_validate(def_field);

        form.addEventListener("submit", (e) => {
            let new_word = {
                word: word_field.value.trim(),
                def: def_field.value.trim(),
                extra: form.elements['extra'].value.trim(),
                source: form.elements['source'].value.trim(),
                rating: 0,
                creator: localStorage.getItem("login"),
                timestamp: Date.now()
            };
            console.log(new_word);
            e.preventDefault();
            CreateWord(new_word);            
        });
    }
}
const CreateWord = function(word) {
    var newWordRef = firebase.database().ref("words/").push();
    newWordRef.set(word);
    Router._instance.navigate("/");
}

const empty_validate = (elem) => {
    if(elem.value == '') {
        elem.setCustomValidity("Field shuld't be empty!")
    }
    else {
        elem.setCustomValidity('')
    }
}

const set_validate = function(elem) {
    empty_validate(elem);
    elem.addEventListener("keyup", () => {
        empty_validate(elem);
    });
}

export default Create;