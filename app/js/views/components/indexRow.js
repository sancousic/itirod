let Row = {
    render : async (word, type) => {
        let view = /*HTML*/`
                    <button class="btn vote">
                        <img id="${word.key}-upvote${type == "day" ? "-day" : ""}" src="./images/thumbs-up-solid.svg" class="btn" alt="">
                    </button>
                    <button class="btn vote">
                        <img id="${word.key}-downvote${type == "day" ? "-day" : ""}" src="./images/thumbs-down-solid.svg" class="btn" alt="">
                    </button>
                    <div class="report">
                        <button id="${word.key}-report${type == "day" ? "-day" : ""}" class="btn report">
                            report
                        </button>
                    </div>
                    `;
        return view;
    },
    after_render: async (word, type) =>
    {   
        let user = { 
            login: localStorage.getItem("login"),
            uid: localStorage.getItem("uid")
        }
        let votes = await GetUsersVote(word.key, user);
        let up_img = document.getElementById(`${word.key}-upvote${type == "day" ? "-day" : ""}`);       
        let down_img = document.getElementById(`${word.key}-downvote${type == "day" ? "-day" : ""}`);

        let report = document.getElementById(`${word.key}-report${type == "day" ? "-day" : ""}`);
        report.addEventListener('click', function() {
            const report_card = document.getElementById("report-card"); 
            let form = document.forms["report-form"];
            form["word-report"].value = word.key;
            report_card.classList.replace("hide", "report-card");
        });

        OnChange(up_img, down_img, user, word);
        const upCancelVote = async function() {
            await ChangeVoteNumber("down", word);
            firebase.database().ref(`users/${user.uid}/${word.key}`).remove();
            up_img.removeEventListener("click", upCancelVote);
            up_img.addEventListener("click", UpVote);
        }
        const downCancelVote = async function() {
            firebase.database().ref(`users/${user.uid}/${word.key}`).remove();
            await ChangeVoteNumber("up", word);
            down_img.removeEventListener("click", downCancelVote);
            down_img.addEventListener("click", DownVote);       
        }
        const UpVote = async function() {
            if(down_img.classList.contains("red")) {
                await downCancelVote();
            }
            await ChangeVoteNumber("up", word);
            AddVote("up", word.key, user);
            up_img.removeEventListener("click", UpVote);
            up_img.addEventListener("click", upCancelVote);
        }
        const DownVote = async function() {
            if(up_img.classList.contains("green")) {
                await upCancelVote();
            }
            await ChangeVoteNumber("down", word);
            AddVote("down", word.key, user);
            down_img.removeEventListener("click", DownVote);
            down_img.addEventListener("click", downCancelVote);
        }
        if(votes.up) {
            up_img.addEventListener("click", upCancelVote);
            down_img.addEventListener("click", DownVote);
        }
        else if (votes.down) {
            down_img.classList.add("red");
            down_img.addEventListener("click", downCancelVote);
            up_img.addEventListener("click", UpVote);
        }
        else {
            down_img.addEventListener("click", DownVote);
            up_img.addEventListener("click", UpVote);
        }
    }
} 

const GetUsersVote = async function(wordId, user) {
    let vote = {};
    await firebase.database()
        .ref(`users/${user.uid}/${wordId}`)
        .once("value")
        .then(function(snapshot) {
            if(snapshot.exists())
            {
                vote.up = snapshot.child("up").val();
                vote.down = snapshot.child("down").val();
            }
        });
    return vote;
}
const AddVote = function(type, wordId, user) {    
    firebase.database().ref(`users/${user.uid}/${wordId}/${type}`).set(true);
}
const ChangeVoteNumber = async function(type, word) {
    const db = firebase.database().ref(`words/${word.key}/rating`);
    let rating;
    await db.once("value").then(function(snapshot) {
        rating = snapshot.val();
    });
    let add = type == "up" ? 1 : -1;
    await db.set(rating + add);
}
const OnChange = async function(up, down, user, word) {
    firebase.database().ref(`users/${user.uid}/${word.key}`)
        .on('value', function(snapshot) {  
            let val = snapshot.val();
            if(snapshot.exists()) {
                if(val.up) {
                    up.classList.add('green');
                    down.classList.remove('red');
                }
                else if(val.down) {
                    up.classList.remove('green');
                    down.classList.add('red');
                }
            } else {
                up.classList.remove('green');
                down.classList.remove('red');
            }
        });
}

export default Row;