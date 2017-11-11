'use strict';

const {obj, arr} = require('iblokz-data');

// namespaces=
const counter = require('./counter');

// initial
const initial = {
	game: {
		ship: {
			rotation: 0
		}
	}
};

// actions
const set = (key, value) => state => obj.patch(state, key, value);
const toggle = key => state => obj.patch(state, key, !obj.sub(state, key));
const arrToggle = (key, value) => state =>
	obj.patch(state, key,
		arr.toggle(obj.sub(state, key), value)
	);

const rotate = (direction, force) => (console.log(direction, force),
	state => obj.patch(state, ['game', 'ship', 'rotation'],
		(state.game.ship.rotation + direction[0] * force) % 360
	));

module.exports = {
	initial,
	counter,
	set,
	toggle,
	arrToggle,
	rotate
};
