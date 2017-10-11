const axios = require('axios');

function followers(e) {
    e.preventDefault();

    const followerAmount = document.querySelector('.thinkers_amount');

    axios
        .post(this.action)
        .then((res) => {
            followerAmount.innerHTML = res.data.followers.length;
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

const followButton = document.querySelector('.follow');
if(followButton) {
    followButton.addEventListener('click', changeImage);
}

export default followers;
