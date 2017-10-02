const axios = require('axios');

function hearts(e) {
    e.preventDefault();

    const heartCount = this.querySelector('p');

    axios
        .post(this.action)
        .then((res) => {
            heartCount.innerHTML = res.data.hearts.length;
        })
        .catch((err) => {
            console.log(err);
        });
}

export default hearts;
