const axios = require('axios');
const dompurify = require('dompurify');
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
    // paramSearch.addEventListener('click', function () {
    //     this.style.display = 'none';
    // })
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

function filterSearchResults(results) {
    const filtered = results.filter(result => result.tags.includes(filter));
    return filtered;
}

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

        let filter = '';
        const filterInputs = [...document.querySelectorAll('input[name="filter"]')];
        filterInputs.map((filterInput) => {
            filterInput.addEventListener('change', function () {
                if (this.checked) {
                    filter = this.value;
                }
            });
        });

        // show the search results
        searchResults.style.display = 'flex';

        axios
            .get(`/api/search?q=${this.value}`)
            .then((res) => {
                if (res.data.length) {
                    const matchingResults = filterSearchResults(res.data);
                    searchResults.innerHTML = dompurify.sanitize(searchResultsHtml(matchingResults));
                    
                    return;
                }
                searchResults.innerHTML = dompurify.sanitize(`<p>No search results for ${this.value} found</p>`);
            })
            .catch((err) => {
                console.log(err);
            });
    });
}

export default typeAhead;
