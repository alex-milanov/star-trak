'use strict';

const {obj, arr} = require('iblokz-data');

// namespaces=
const counter = require('./counter');

// initial
const initial = {
	game: {
		ship: {
			rotation: 0
		},
		settings: {
			moveSpeed: 1 //pixels per tick
		},
		asteroid:{
			pos: {x: 620, y: 50},
			frame: 0,
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

function getShipPosition(state){
	return {x: 620, y: 255};
}

function calcNewPosition(oldPos, state){
	let shipPos = getShipPosition(state);
	let normFactor = Math.sqrt((shipPos.x - oldPos.x)*(shipPos.x - oldPos.x)+
							   (shipPos.y - oldPos.y)*(shipPos.y - oldPos.y));
	if (normFactor >= 1){
		let dx = (shipPos.x - oldPos.x)/normFactor * state.game.settings.moveSpeed;
		let dy = (shipPos.y - oldPos.y)/normFactor * state.game.settings.moveSpeed;

		return {
			x: oldPos.x + dx,
			y: oldPos.y + dy
		};
	}
	else{
		return {
			x: Math.random() * 1000,
			y: 50
		}
	}
}

const moveAsteroid = () => (
	state => obj.patch(state, ['game', 'asteroid', 'pos'], calcNewPosition(state.game.asteroid.pos, state))
);

module.exports = {
	initial,
	counter,
	set,
	toggle,
	arrToggle,
	rotate,
	moveAsteroid
};
