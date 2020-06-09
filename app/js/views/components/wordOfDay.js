import {Router} from "../../router.js";
import Row from "./indexRow.js";
import MainPage from "../pages/mainPage.js";
import {wordsCardData} from "../pages/mainPage.js";
import {GetFormatedDate} from "./feedCard.js";

let WordOfDay = {
    wordOfDay: null,
    render: async (word) => {
        let view = /*HTML*/`                    
                    <div class="text date">
                        <p class="text date">From ${word.creator} at ${GetFormatedDate(word.timestamp)}</p>
                    </div>
                    <div class="text word">
                        <p class="word">${word.word}</p>
                    </div>
                    <div class="text def">
                        <p class="def">${word.def}</p>
                    </div>
                    <div class="text comment"> 
                        <p class="comment">${word.extra}</p>
                    </div>
                    <div class="text links" id="${word.key}-links-day">                            
                    </div>
                    <div class="index-row" id="${word.key}-row-day">
                        <div class="rating">
                            <p class="rating" id="${word.key}-rating-day">${word.rating}</p>
                        </div>
                    </div>                       
                    `
        return view;
    },
    after_render: async (word) => {
        let user = firebase.auth().currentUser
        let rating_view = document.getElementById(`${word.key}-rating-day`);
        const ref = firebase.database().ref(`words/${word.key}/rating`);
        
        if(user) {
            let rowElem = document.getElementById(word.key+"-row-day");
            let rowView = await Row.render(word, "day");
            rowElem.insertAdjacentHTML('beforeend', rowView);
            await Row.after_render(WordOfDay.wordOfDay, "day");
        }
    },
    getWordOfDay: async () => {
        await firebase.database()
            .ref("wordOfDay/")
            .once('value')
            .then(async function(snapshot) {
                WordOfDay.wordOfDay = snapshot.val();
                if(!snapshot.exists() || Date.now() - WordOfDay.wordOfDay.dayTimestamp > (24 * 60 * 60 * 1000)) {
                    WordOfDay.wordOfDay = await GetNewWord();
                }
        });
        return WordOfDay.wordOfDay;
    },
    NoWordOfDay: async () => {
        let view = /*HTML*/`
                    <div class="have-not-wod">Все слова имеют отрицательный рейтинг</div>
                    `;
        return view;
    }
}

const GetNewWord = async function() {
    let pos = [];
    await firebase.database()
        .ref('words/')
        .once('value', function(snapshot) {
            snapshot.forEach(function(child) {
                let word = child.val();
                if(word.rating > 0)
                {
                    word.key = child.key;
                    pos.push(word);
                }   
            });
        });
    let res = pos[Math.floor(Math.random() * pos.length)];
    if(!res) {
        res = null;        
    }
    else {
        res.dayTimestamp = Date.now();
    }
    firebase.database().ref('wordOfDay/').set(res);
    return res;
}
export default WordOfDay;