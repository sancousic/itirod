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
                            <div>
                                <form class="create-form">
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
                    </div>      
                    `;
        return view;
    },
    after_render: async () => {

    }
}

export default Create;