import Router from "../../router.js";

let Create = {
    render: async() => {
        let view = /*HTML*/`
                    <div class="content">
                        <div class="h-container">   
                            <div class="h-box">
                                <h1 class="day">Create word</h1>
                            </div>                         
                        </div>
                        <div class="card">                
                            <div>
                                <form>
                                    <label for="word">Word</label>
                                    <input type="text" placeholder="Input your word here" name="word" id="word">
                                    <label for="def">Defenition</label>
                                    <input type="text" placeholder="Input your word defenition here" name="def" id="def">
                                    <label for="extra">Extra comments</label>
                                    <textarea name="extra" placeholder="Input your extra comments here" id="extra"></textarea>
                                    <label for="source">Sources</label>
                                    <textarea name="source" placeholder="Input your sources" id="source"></textarea>                       
                                    <input type="submit" value="Create">                                           
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