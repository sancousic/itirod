import {Router} from "../../router.js";
import Row from "./indexRow.js";
import MainPage from "../pages/mainPage.js";
import {wordsCardData} from "../pages/mainPage.js";
import WordOfDay from "./wordOfDay.js";

let ReportCard = {
    render: async () => {
        let view = /*HTML*/`                   
                    <div class="hide" id="report-card">
                        <form name="report-form" class="report-form">
                            <input type="hidden" id="word-report" name="word-report">
                            <textarea name="report-area" id="report-area" placeholder="Input your report"></textarea>
                            <input type="submit" value="Report" class="report-submit">
                        </form>      
                    </div>             
                    `
        return view;
    },
    after_render: async () => {
        let report_form = document.forms["report-form"];
        const report_card = document.getElementById("report-card");
        report_card.addEventListener('click', function(e) {
            if(!report_form.contains(e.target)) {
                report_card.classList.replace("report-card", "hide");
            }
        });
        report_form.addEventListener("submit", (e) => {
            let word = report_form["word-report"].value;
            let report_text = report_form["report-area"].value;
            e.preventDefault();
            let reportObj = {
                report: report_text,
                user: localStorage.getItem("uid"),
                login: localStorage.getItem("login"),
                word_id: word
            };
            firebase.database().ref(`reports/`).push(reportObj);            
            
            report_card.classList.replace("report-card", "hide");
        });
    }
}

export default ReportCard;