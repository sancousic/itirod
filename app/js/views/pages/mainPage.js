import Router from "../../router.js";

let MainPage = {
    render: async() => {
        let view = /*HTML*/`
                    <div class="content">
                    <section>
                        <div>
                            <div class="h-container">   
                                <div class="h-box">
                                    <h1 class="day">Word of day</h1>
                                </div>                         
                            </div>
                            <div class="card" id="day-card">
                                
                            </div>                        
                        </div>                
                    </section>
                    
                    <section>
                        <div class="h-container">
                            <div class="h-box">
                                <div class="sort">
                                    <button class="sort" id="btn-date__sort">date</button>
                                    <button class="sort" id="btn-rating__sort">rating</button>
                                </div>
                                <div class="feed">
                                    <h1 class="sort">Word feed</h1>
                                </div>
                            </div>            
                        </div>           
                    </section>
                    </div>           
                    `;
        return view;                    
    },
    after_render: async () => {
        
    }
}

export default MainPage;