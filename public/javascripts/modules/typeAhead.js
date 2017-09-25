const axios = require('axios');

function searchResultsHtml(ideas) {
    return ideas
        .map(idea => `
            <a href="/ideas/${idea._id}/">
                <strong>${idea.title}</strong>
            </a>
        `)
        .join();
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

        // show the search results
        searchResults.style.display = 'block';

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
