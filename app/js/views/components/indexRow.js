let Row = {
    render : async (word) => {
        let view = /*HTML*/`
                    <button class="btn vote">
                        <img id="${word.key}-upvote" src="./images/thumbs-up-solid.svg" class="btn" alt="">
                    </button>
                    <button class="btn vote">
                        <img id="${word.key}-downvote" src="./images/thumbs-down-solid.svg" class="btn" alt="">
                    </button>
                    <div class="report">
                        <button class="btn report">
                            report
                        </button>
                    </div>
                    `;
        return view;
    },
    after_render: async (word) =>
    {   
        let user = { 
            login: localStorage.getItem("login"),
            uid: localStorage.getItem("uid")
        }
        let votes = await GetUsersVote(word.key, user);
        let up_img = document.getElementById(`${word.key}-upvote`);
       
        let down_img = document.getElementById(`${word.key}-downvote`);

        const upCancelVote = async function() {
            console.log("CancelVote");
            await ChangeVoteNumber("down", word);
            firebase.database().ref(`users/${user.uid}/${word.key}`).remove();
            up_img.classList.remove("green");
            up_img.removeEventListener("click", upCancelVote);
            up_img.addEventListener("click", UpVote);
        }
        const downCancelVote = async function() {
            console.log("CancelVote");
            firebase.database().ref(`users/${user.uid}/${word.key}`).remove();
            await ChangeVoteNumber("up", word);
            down_img.classList.remove("red");     
            down_img.removeEventListener("click", downCancelVote);
            down_img.addEventListener("click", DownVote);       
        }
        const UpVote = async function() {
            console.log("UpVote");
            if(down_img.classList.contains("red")) {
                await downCancelVote();
            }
            await ChangeVoteNumber("up", word);
            AddVote("up", word.key, user);
            up_img.classList.add("green");
            up_img.removeEventListener("click", UpVote);
            up_img.addEventListener("click", upCancelVote);
        }
        const DownVote = async function() {
            console.log("DownVote");
            if(up_img.classList.contains("green")) {
                await upCancelVote();
            }
            await ChangeVoteNumber("down", word);
            AddVote("down", word.key, user);
            down_img.classList.add("red");
            down_img.removeEventListener("click", DownVote);
            down_img.addEventListener("click", downCancelVote);
        }
        if(votes.up) {
            up_img.classList.add("green");
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
    console.log("user:", user);
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

export default Row;