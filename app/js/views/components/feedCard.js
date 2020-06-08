import {Router} from "../../router.js";
import Row from "./indexRow.js";
import MainPage from "../pages/mainPage.js";
import {wordsCardData} from "../pages/mainPage.js";
import WordOfDay from "./wordOfDay.js";

let FeedCard = {
    render: async (word) => {
        let view = /*HTML*/`
                    <div class="index-card" id="${word.key}">
                        <div class="text date">
                            <p class="text date">From ${word.creator} at ${new Date(word.timestamp)}</p>
                        </div>
                        <div class="text word">
                            <p class="word">${word.word}</p>
                        </div>
                        <div class="text def">
                            <p class="def">${word.def}</p>
                        </div>
                        <div class="index-row" id="${word.key}-row">
                            <div class="rating">
                                <p class="rating" id="${word.key}-rating">${word.rating}</p>
                            </div>
                        </div>
                    </div>     
                    `
        return view;
    },
    after_render: async (word) => {
        let user = firebase.auth().currentUser
        let rating_view = document.getElementById(`${word.key}-rating`);
        const ref = firebase.database().ref(`words/${word.key}/rating`);
        
        if(user) {
            let rowElem = document.getElementById(word.key+"-row");
            let rowView = await Row.render(word, "");
            rowElem.insertAdjacentHTML('beforeend', rowView);
            await Row.after_render(word, "");
        }
        ref.on('value', async function(data) {
            let rating = data.val();
            
            const index = wordsCardData.indexOf(word);
            if(rating < -30) {
                wordsCardData.splice(index, 1);
                if(Router.currentPage == MainPage) {
                    let card = document.getElementById(`${word.key}`);
                    card.remove();
                }
                await firebase.database().ref(`words/${word.key}`).remove();
            }
            else {
                wordsCardData[index].rating = rating;
                if(Router.currentPage == MainPage) {                    
                    rating_view.innerHTML = rating;
                    if(WordOfDay.wordOfDay.key == word.key) {
                        let rating_day_view = document.getElementById(`${word.key}-rating-day`);
                        rating_day_view.innerHTML = rating;
                    }
                }
            }
            // for(let i = 0; i < wordsCardData.length; i++) {
            //     if(wordsCardData[i].key == word.key) {
            //         wordsCardData[i].rating = rating;
            //         break;
            //     }
            // }
        })
    }
}


export default FeedCard;