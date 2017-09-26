const axios = require('axios');

function readingList(e) {
    const readingListCounter = document.querySelector('.reading_list_counter');
    // add idea to reading list
    e.preventDefault();
    axios
        .post(this.action)
        .then((res) => {
            readingListCounter.innerHTML = res.data.readingList.length;
        })
        .catch((err) => {
            console.log(err);
        });
}

// Toggle icon from add to remove
function changeImage() {
    this.classList.toggle('add_to_reading_list_remove');
}

const addToReadingListIcons = [
    ...document.querySelectorAll('.add_to_reading_list')
];
addToReadingListIcons.map(addToReadingListIcon =>
    addToReadingListIcon.addEventListener('click', changeImage));

export default readingList;
