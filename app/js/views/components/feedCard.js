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
                        <div class="index-row">
                            <div class="rating">
                                <p class="rating">${word.rating}</p>
                            </div>
                        </div>
                    </div>     
                    `
        return view;
    },
    after_render: async () => {

    }
}

export default FeedCard;