import typeAhead from './modules/typeAhead';
import readingList from './modules/readingList';
import hearts from './modules/hearts';
import followers from './modules/followers'

// Import scss for webpack compiling
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

// Heart ideas
const heartsButtons = [...document.querySelectorAll('.heartlist_form')];
heartsButtons.map(heartButton =>
    heartButton.addEventListener('submit', hearts));

// Make input as big as placeholder text
const searchInput = document.querySelector('input[name=search]');
searchInput.setAttribute('size', searchInput.getAttribute('placeholder').length);

// Follow users
const followButton = document.querySelector('.followers_form');
if(followButton) {
    followButton.addEventListener('submit', followers);
}
