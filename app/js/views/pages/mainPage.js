import {Router} from "../../router.js";
import FeedCard from "../components/feedCard.js";
import WordOfDay from "../components/wordOfDay.js";
import ReportCard from "../components/report.js";

export let wordsCardData;
const wordsRef = firebase.database().ref("words/");
let feed_section;

let MainPage = {
    sortType: "date",
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
                            <a class="index-card-day" id="day-card">                                
                            </a>                        
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
        let dateSortBtn =  document.getElementById("btn-date__sort");
        let ratingSortBtn =  document.getElementById("btn-rating__sort");

        let report_card = await ReportCard.render();
        document.getElementById("wrapper").insertAdjacentHTML('beforeend', report_card);
        await ReportCard.after_render(); 

        let word_of_day = await WordOfDay.getWordOfDay();        
        if(word_of_day) {
            let day_card = document.getElementById('day-card');
            day_card.href = `/details/${word_of_day.key}`
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
        dateSortBtn.addEventListener('click', function() {
            if(MainPage.sortType == 'date') {
                SortCards('date2');
            }
            else {
                SortCards('date');
            }            
        });
        ratingSortBtn.addEventListener('click', function() {
            if(MainPage.sortType == 'rating') {
                SortCards('rating2');
            }
            else {
                SortCards('rating');
            }
        });
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
const SortCards = function(type) {    
    let nodeList = document.querySelectorAll("div.index-card");
    var itemsArray = [];
    const parent = nodeList[0].parentNode;
    for(var i = 0; i < nodeList.length; i++) {
        itemsArray.push(parent.removeChild(nodeList[i]));
    }    
    itemsArray.sort(function(node1, node2) {
        if(type == "date") {
            return DateComparator(node1, node2);
        }
        else if(type == "date2") {
            return DateComparator(node2, node1);
        }
        else if(type == "rating") {
            return RatingComparator(node1, node2);
        }
        else {
            return RatingComparator(node2, node1);
        }
    }).forEach(function(node) {
        parent.appendChild(node); 
    });
    MainPage.sortType = type;
}
/*The unique key generated by push() is based on a timestamp,
     so list items are automatically ordered chronologically.
     https://firebase.google.com/docs/database/web/lists-of-data */
const DateComparator = function(item1, item2) {    
    if(item1.id < item2.id) {
        return -1;
    }
    if(item1.id > item2.id) {
        return 1;
    }
    return 0;
}
const RatingComparator = function(item1, item2) {
    let rate1 = item1.querySelector('p.rating');
    let rate2 = item2.querySelector('p.rating');
    let num1 = parseInt(rate1.innerHTML);
    let num2 = parseInt(rate2.innerHTML);
    if(num1 < num2) return -1;
    if(num1 > num2) return 1;
    return 0;
}
export default MainPage;