'use strict';

const {
	header, div, section,
	ul, li, a, h1, img, p,
	button, span
} = require('iblokz-snabbdom-helpers');

const asteroid = require('./asteroid');

module.exports = ({state, actions}) => section('#game', [
	asteroid(state.game.asteroid, state.game.asteroid.chord),
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
	p('#score', `Score: ${state.game.settings.points}`),
	p('#lifes', `Lifes: ${state.game.settings.lifes}`)
]);
