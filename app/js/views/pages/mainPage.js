import {Router} from "../../router.js";
import FeedCard from "../components/feedCard.js";
import WordOfDay from "../components/wordOfDay.js";

export let wordsCardData;
const wordsRef = firebase.database().ref("words/");
let feed_section;

let MainPage = {
    render: async() => {
        let view = /*HTML*/`
                    <div class="content">
                    <section>
                        <div>
                            <div class="h-container">   
                                <div class="h-box">
                                    <h1 class="standart">Word of day</h1>
                                </div>                         
                            </div>
                            <div class="index-card" id="day-card">                                
                            </div>                        
                        </div>                
                    </section>                    
                    <section id="feed-section">
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
        feed_section = document.getElementById("feed-section");
        let wordOfDayCard = document.getElementById("day-card");

        let word_of_day = await WordOfDay.getWordOfDay();        
        if(word_of_day) {
            let wordOfDayView = await WordOfDay.render(word_of_day);
            wordOfDayCard.insertAdjacentHTML('beforeend', wordOfDayView);
            WordOfDay.after_render(word_of_day);
        } else {
            let wordOfDayView = await WordOfDay.NoWordOfDay();
            wordOfDayCard.insertAdjacentHTML('beforeend', wordOfDayView);
        }            

        if(!wordsCardData) {
            wordsCardData = [];
            await GetWordsData();
        } else {
            for (const word of wordsCardData) {
                let card = await FeedCard.render(word);
                feed_section.insertAdjacentHTML('beforeend', card);
                await FeedCard.after_render(word);
            }
        }
    }
}

const GetWordsData = async () => {
    wordsRef.on('child_added', async function(data) {
        let word = data.val();
        word.key = data.key;
        wordsCardData.push(word);
        if(Router.currentPage == MainPage)
        {
            let card = await FeedCard.render(word);
            feed_section.insertAdjacentHTML('beforeend', card); 
            await FeedCard.after_render(word);
        }    
    });
}

export default MainPage;