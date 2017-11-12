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
			note: 'a'
		},
		settings: {
			moveSpeed: 1,
			lifes: 3000,
			points: 0
		},
		asteroid:{
			pos: {x: 620, y: 50},
			chord: '0',
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

function newAsteroid(state){
	const allChords = ['C', 'D', 'E', 'F', 'G', 'A', 'H'];
	const idx = Math.floor(Math.random() * 7);
	let asteroid = state.game.asteroid;
	asteroid.pos = { x: 370 + Math.random()*530, y: 50 };
	asteroid.chord = allChords[idx];

	document.getElementById('chord').innerHTML = (asteroid.chord);
	document.getElementById('score').innerHTML = (state.game.settings.points) + ' points';
	return asteroid;
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
		return { x: 0, y: 0 };
	}
}

function changeAsteroid(state){
	let asteroid = state.game.asteroid;

	if (asteroid.chord == '0') return newAsteroid(state);

	asteroid.rot += Math.random()*5;

	if (state.game.audio.note == asteroid.chord){
		state.game.settings.points += 100;
		window.alert('Hit it! Points: ' + state.game.settings.points);
		return newAsteroid(state);
	}

	asteroid.pos = calcNewPosition(asteroid.pos, state);
	if (asteroid.pos.y < 4)
		return newAsteroid(state);
	else
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
