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
		audio: {
			note: 'C'
		},
		settings: {
			moveSpeed: 1,
			lifes: 3
		},
		asteroid:{
			pos: {x: 620, y: 50},
			chord: 'C',
			frame: 0,
			rot: 0
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

const rotate = (direction, force) => (
	state => obj.patch(state, ['game', 'ship', 'rotation'],
		(state.game.ship.rotation + direction[0] * force) % 360
	));


function crashShip(state){
	if (state.game.settings.lifes > 0)
		--state.game.settings.lifes
	else
		window.alert('You are dead!!!');
}

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
		crashShip(state);
		return {
			x: 370 + Math.random()*530,
			y: 50
		}
	}
}

function changeAsteroid(state){
	let asteroid = state.game.asteroid;

	asteroid.rot += Math.random()*5;

	if (state.game.audio.note == asteroid.chord){
		asteroid.chord = '0';
		console.log('----------->', asteroid);
	}

	asteroid.pos = calcNewPosition(asteroid.pos, state);
	return asteroid;
}

const moveAsteroid = () => (
	state => obj.patch(state, ['game', 'asteroid'], changeAsteroid(state))
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
