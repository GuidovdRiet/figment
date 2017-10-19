const axios = require('axios');
const dompurify = require('dompurify');
const searchIcon = document.querySelector('.search_icon');
const searchWindow = document.querySelector('.search');
const checkboxes = document.querySelectorAll('input[name=filter]');
const searchInput = document.querySelector('input[name=search]');

const focusField = () => {
    searchInput.focus();
    searchInput.select();
};

function focusCursorAfterSelect(e) {
    // Prevent that the handler runs the function twice
    e.stopPropagation();
    e.preventDefault();

    // Uncheck radio button when selected
    if (this.querySelector('input[type=radio').checked) {
        this.querySelector('input[type=radio]').checked = false;
        focusField();
        return;
    }
    // check checkbox of the current clicked field
    this.querySelector('input[type=radio]').checked = true;
    focusField();
}

const removeSearchBoxWithFadeOut = (searchBox) => {
    const searchScreen = searchBox;
    searchScreen.classList.add('remove_search');
    searchScreen.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'opacity') return;
        searchScreen.classList.remove('remove_search');
        searchScreen.style.display = 'none';
    });
};

const closeSearch = (search) => {
    const paramSearch = search;
    const exitIcon = document.querySelector('.exit_icon');
    exitIcon.addEventListener('click', () => {
        removeSearchBoxWithFadeOut(paramSearch);
    });
    window.addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
            removeSearchBoxWithFadeOut(paramSearch);
        }
    });
};

if (searchIcon) {
    searchIcon.addEventListener('click', () => {
        const search = document.querySelector('.search');
        const input = document.querySelector('input[name="search"]');
        search.style.display = 'flex';
        input.focus();
        closeSearch(search);
    });
}

const searchResultsHtml = ideas =>
    ideas
        .map(idea => `
            <a href="/ideas/${idea._id}/">
                <strong>&#8594 ${idea.title}</strong>
                <p>${idea.body
        .split(' ')
        .slice(0, 25)
        .join(' ')}</p>
            </a>
        `)
        .join('');

function typeAhead(search) {
    if (!search) return;

    const searchResults = document.querySelector('.search_results');

    searchInput.addEventListener('input', function () {
    // if there is no value in the input, stop
        if (!this.value) {
            searchResults.style.display = 'none';
            return;
        }

        let checkboxValues = null;
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                checkboxValues = checkbox.value;
            }
        });

        // show the search results
        searchResults.style.display = 'flex';

        axios
            .get(`/api/search?q=${this.value}`)
            .then((res) => {
                if (res.data.length) {
                    const results = res.data.filter(result =>
                        result.tags.includes(checkboxValues));
                    searchResults.innerHTML = dompurify.sanitize(searchResultsHtml(checkboxValues ? results : res.data));
                    return;
                }
                searchResults.innerHTML = dompurify.sanitize(`<p>No search results for ${this.value} found</p>`);
            })
            .catch((err) => {
                console.log(err);
            });
    });
}

// Select the input field after every click, because the cursor is not visible in the dom
const tags = [...document.querySelectorAll('.tag')];
tags.map(tag => tag.addEventListener('click', focusCursorAfterSelect));
searchWindow.addEventListener('click', focusField);

export default typeAhead;
