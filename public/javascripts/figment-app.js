import typeAhead from './modules/typeAhead';
require('../sass/app.scss');

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


typeAhead($('.search'));
