const axios = require('axios');
const searchIcon = document.querySelector('.search_icon');

const closeSearch = (search) => {
    const paramSearch = search;
    const exitIcon = document.querySelector('.exit_icon');
    exitIcon.addEventListener('click', () => {
        paramSearch.style.display = 'none';
    });
    window.addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
            paramSearch.style.display = 'none';
        }
    });
};

searchIcon.addEventListener('click', () => {
    const search = document.querySelector('.search');
    search.style.display = 'flex';
    closeSearch(search);
});

const searchResultsHtml = ideas =>
    ideas
        .map(idea => `
            <a href="/ideas/${idea._id}/">
                <strong>&#8594 ${idea.title}</strong>
            </a>
        `)
        .join('');

function typeAhead(search) {
    if (!search) return;

    const searchInput = document.querySelector('input[name="search"]');
    const searchResults = document.querySelector('.search_results');

    searchInput.addEventListener('input', function () {
    // if there is no value in the input, stop
        if (!this.value) {
            searchResults.style.display = 'none';
            return;
        }

        // show the search results
        searchResults.style.display = 'flex';

        axios
            .get(`/api/search?q=${this.value}`)
            .then((res) => {
                if (res.data.length) {
                    searchResults.innerHTML = searchResultsHtml(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
}

export default typeAhead;
