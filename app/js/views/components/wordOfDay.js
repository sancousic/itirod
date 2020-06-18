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
        let user = firebase.auth().currentUser;
        render_source(word);
        if(Router.currentPage == MainPage) {
            let card = document.getElementById('day-card');            
            card.addEventListener('click', function(e) {
                e.preventDefault();
                let sources = document.getElementsByClassName(`${word.key}-ref`);
                for (let i = 0; i < sources.length; i++) {
                    if(sources[i].contains(e.target)) {
                        return;
                    }
                }
                let destination;
                let target = e.target;
                while (!destination) {
                    destination = target.href;
                    target = target.parentElement;
                }
                if(user) { 
                    let up_img = document.getElementById(`${word.key}-upvote-day`);       
                    let down_img = document.getElementById(`${word.key}-downvote-day`);  
                    let report = document.getElementById(`${word.key}-report-day`);  

                    if((!up_img.contains(e.target)) && (!down_img.contains(e.target))
                        && (!report.contains(e.target))) {
                        Router._instance.navigate(destination);
                    }
                }
                else {
                    Router._instance.navigate(destination);
                }
            });
        }
        if(user) {
            let rowElem = document.getElementById(word.key+"-row-day");
            let rowView = await Row.render(word, "day");
            rowElem.insertAdjacentHTML('beforeend', rowView);
            await Row.after_render(word, "day");
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

const is_url = function(str) {
    let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/g;
    if (regexp.test(str)) {
        return true;
    } else {
        return false;
    }
}

const render_source = function(word) {
    let source = word.source;
    if(source) {
        let source_view = document.getElementById(`${word.key}-links-day`);
        let arr = source.split(' ');
        for (let i = 0; i < arr.length; i++) {
            if(is_url(arr[i])) {
                var a = document.createElement('a');
                var link = document.createTextNode(arr[i]);
                a.appendChild(link);
                a.href = arr[i];
                a.target = '_blank';
                a.classList.add('source-ref');
                a.classList.add(`${word.key}-ref`);
                source_view.appendChild(a);
            } else {
                source_view.innerHTML += arr[i];
            }
            source_view.innerHTML += ' ';
        }
    }
}

export default WordOfDay;