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
                            <p class="text date">From ${word.creator} at ${GetFormatedDate(word.timestamp)}</p>
                        </div>
                        <div class="text word">
                            <p class="word">${word.word}</p>
                        </div>
                        <div class="text def">
                            <p class="def">${GetShortDef(word.def)}</p>
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
        
        let card = document.getElementById(word.key);
        card.addEventListener('click', function(e) {    
            let up_img = document.getElementById(`${word.key}-upvote`);       
            let down_img = document.getElementById(`${word.key}-downvote`);  
            let report = document.getElementById(`${word.key}-report`);       
            if(user && (!up_img.contains(e.target)) 
                && (!down_img.contains(e.target))
                 && (!report.contains(e.target))) {
                    Router._instance.navigate(`/details/${word.key}`);
            }
        });

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

const GetShortDef = function(defenition) {
    if(defenition.length < 50) {
        return defenition;
    }

    return defenition.substring(0, 50).trim() + '...';
}

export const GetFormatedDate = function(ms) {
    let date = new Date(ms);
    return /*DateFormat?*/`${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.` +
                `${date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)}.` +
                `${date.getFullYear()} ${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:` +
                `${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
}

export default FeedCard;