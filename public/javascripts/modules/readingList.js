const axios = require('axios');

function readingList(e) {
    const readingListCounter = document.querySelector('.reading_list_counter');
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
            })
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

const addToReadingListIcons = [
    ...document.querySelectorAll('.add_to_reading_list')
];
addToReadingListIcons.map(addToReadingListIcon =>
    addToReadingListIcon.addEventListener('click', changeImage));

export default readingList;
