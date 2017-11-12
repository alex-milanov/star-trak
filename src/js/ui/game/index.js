'use strict';

const {
	header, div, section,
	ul, li, a, h1, img, p,
	button, span
} = require('iblokz-snabbdom-helpers');

const asteroid = ({pos = {x: 20, y: 30}, rot = 0, size = 48, frame = 1, model = 1}) =>
	section('.asteroid', {
		style: {
			top: `${pos.y}px`,
			left: `${pos.x}px`,
			height: `${size}px`,
			width: `${size}px`,
			marginTop: `${size / 2}px`,
			marginLeft: `${size / 2}px`,
//			backgroundPosition: `${-frame * size}px 0`,
			backgroundImage: `url('assets/img/asteroid-0${model}.png')`,
			backgroundSize: `auto ${size}px`,
			transform: `rotate(${rot}deg)`
		}
	});

module.exports = ({state, actions}) => section('#game', [
	asteroid(state.game.asteroid),
	img('#ship[src="assets/img/space-ship.png"]', {
		style: {
			left: `${state.game.ship.pos.x}px`,
			top: `${state.game.ship.pos.y}px`,
			width: '64px',
			height: '64px',
			marginLeft: '-32px',
			marginTop: '-32px',
			transform: `rotate(${state.game.ship.rot}deg)`
		}
	}),
	p('#chord', `Note: ${state.game.asteroid.chord || ''}`),
	p('#score', `Score: ${state.game.settings.points}`),
	p('#lifes', `Lifes: ${state.game.settings.lifes}`)
]);
