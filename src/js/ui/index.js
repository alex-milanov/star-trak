'use strict';

// dom
const {
	h1, a, div,
	section, button, span
} = require('iblokz-snabbdom-helpers');
// components
const header = require('./header');
const game = require('./game');
const midiKeyboard = require('./midi-keyboard');

module.exports = ({state, actions}) => section('#ui', [
	header({state, actions}),
	game({state, actions}),
	midiKeyboard({state, actions})
]);
