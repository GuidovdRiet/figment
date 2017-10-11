const axios = require('axios');

const ifNoItemsInReadingListHtml = () =>
    `   
        <div class="full_width_card">
            <a href='/'>
                <h1>Add ideas to your reading list..</h1>
            </a>
        </div>
    `;

function readingList(e) {
    const readingListCounter = document.querySelector('.reading_list_counter');
    const cardId = e.target.getAttribute('data-card-id');
    console.log(cardId);
    const isReadingList = e.target.getAttribute('data-reading-list');
    // add idea to reading list
    e.preventDefault();
    axios
        .post(this.action)
        .then((res) => {
            readingListCounter.innerHTML = res.data.readingList.length;
            // Add scale animation when the reading list counter changes
            readingListCounter.classList.toggle('scale_animate');
            readingListCounter.addEventListener('animationend', () => {
                readingListCounter.classList.remove('scale_animate');
                if (isReadingList === 'true') {
                    const ideaCard = document.querySelector(`.idea_${cardId}`);
                    if(ideaCard) {
                        ideaCard.remove();
                    }
                }
                if (res.data.readingList.length <= 0) {
                    document.querySelector('.full_width_card').innerHTML = ifNoItemsInReadingListHtml();
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

// Toggle icon from add to remove
function changeImage() {
    if (this.classList.contains('remove_icon')) {
        this.classList.remove('remove_icon');
        this.classList.add('active_icon');
        return;
    }
    if (this.classList.contains('active_icon')) {
        this.classList.remove('active_icon');
        this.classList.add('remove_icon');
    }
}

// Handle event handling for add to reading list button
const addToReadingListIcons = [
    ...document.querySelectorAll('.add_to_reading_list')
];
addToReadingListIcons.map(addToReadingListIcon =>
    addToReadingListIcon.addEventListener('click', changeImage));

export default readingList;
