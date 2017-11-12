'use strict';

const {
	header, div, section,
	ul, li, a, h1, img, p,
	button, span
} = require('iblokz-snabbdom-helpers');

const asteroid = ({pos = {x: 20, y: 30}, rot = 0, size = 48, frame = 1}) =>
	section('.asteroid', {
		style: {
			top: `${pos.y}px`,
			left: `${pos.x}px`,
			height: `${size}px`,
			width: `${size}px`,
			marginTop: `${size / 2}px`,
			marginLeft: `${size / 2}px`,
//			backgroundPosition: `${-frame * size}px 0`,
			backgroundSize: `auto ${size}px`,
			transform: `rotate(${rot}deg)`
		}
	});

module.exports = ({state, actions}) => section('#game', [
	asteroid({rot: state.game.asteroid.rot, pos: state.game.asteroid.pos}),
	img('#ship[src="assets/img/space-ship.png"]', {
		style: {
			width: '64px',
			height: '64px',
			transform: `rotate(${state.game.ship.rotation}deg)`
		}
	}),
	p('#chord', 
		{style: {
		}
	}),
	p('#score', 
		{style: {
		}
	}),
	p('#lifes', 
		{style: {
		}
	})
]);

