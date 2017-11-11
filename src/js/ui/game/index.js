'use strict';

const {
	header, div, section,
	ul, li, a, h1, img,
	button, span
} = require('iblokz-snabbdom-helpers');

/*
const asteroid = ({pos = {x: 20, y: 30}, rot, size, frame = 0}) =>
	section('.asteroid', {
		style: {
			top: `${pos.y}px`,
			left: `${pos.x}px`,
			height: `${size}px`
		}
	})
*/

module.exports = ({state, actions}) => section('#game', [
	img('#ship[src="assets/img/ship.svg"]', {
		style: {
			width: '64px',
			height: '64px',
			transform: `rotate(${state.game.ship.rotation}deg)`
		}
	})
]);
