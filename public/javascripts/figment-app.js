import typeAhead from './modules/typeAhead';
import readingList from './modules/readingList';

require('../sass/app.scss');

// Search Type ahead
const search = document.querySelector('.search');
typeAhead(search);

// Add ideas to reading list
const addToReadingListButtons = [
    ...document.querySelectorAll('.readinglist_form')
];

addToReadingListButtons.map(addToReadingListButton =>
    addToReadingListButton.addEventListener('submit', readingList));
