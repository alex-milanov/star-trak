'use strict';

const {
	header, div, section,
	ul, li, a, h1,
	button, span
} = require('iblokz-snabbdom-helpers');

module.exports = ({state, actions}) => header([
	h1('Star Trak')
]);
