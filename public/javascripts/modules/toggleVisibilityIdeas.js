const axios = require('axios');

const toggleClassButton = (idea, button) => {

    const toggleButton = button;

    if(idea.visible) {
        toggleButton.classList.remove('toggle_visibility_inactive');
        toggleButton.classList.add('toggle_visibility_active');
        toggleButton.querySelector('p').innerHTML = 'visible';        
    } else {
        toggleButton.classList.remove('toggle_visibility_active');
        toggleButton.classList.add('toggle_visibility_inactive');
        toggleButton.querySelector('p').innerHTML = 'invisible';
    }
}

function toggleVisibility(e) {
    e.preventDefault();
    const button = this.querySelector('button');
    axios
        .post(this.action)
        .then((res) => {
            toggleClassButton(res.data, button);
        })
        .catch((err) => {
            console.log(err);
        });
}

export default toggleVisibility;
