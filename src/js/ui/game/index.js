'use strict';

const {
	header, div, section,
	ul, li, a, h1, img,
	button, span
} = require('iblokz-snabbdom-helpers');

const asteroid = ({pos = {x: 20, y: 30}, rot = 0, size = 64, frame = 1}) =>
	section('.asteroid', {
		style: {
			top: `${pos.y}px`,
			left: `${pos.x}px`,
			height: `${size}px`,
			width: `${size}px`,
			marginTop: `${size / 2}px`,
			marginLeft: `${size / 2}px`,
			backgroundPosition: `${-frame * size}px 0`,
			backgroundSize: `auto ${size}px`
		}
	});

module.exports = ({state, actions}) => section('#game', [
	asteroid({size: 48, pos: {x: 620, y: 50}}),
	img('#ship[src="assets/img/ship.svg"]', {
		style: {
			width: '64px',
			height: '64px',
			transform: `rotate(${state.game.ship.rotation}deg)`
		}
	})
]);
