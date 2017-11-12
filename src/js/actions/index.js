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
			note: 'C',
			pressed: []
		},
		settings: {
			moveSpeed: 1,
			lifes: 4,
			points: 0
		},
		asteroid: {
			pos: {x: 620, y: 50},
			chord: '0',
			frame: 0,
			rot: 0
		}
	},
	pressedKeys: []
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
	const allChords = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'H4'];
	const idx = Math.floor(Math.random() * 7);
	let asteroid = state.game.asteroid;
	asteroid.pos = { x: 370 + Math.random()*530, y: 50 };
	asteroid.chord = allChords[idx];

	document.getElementById('chord').innerHTML = (asteroid.chord);
	document.getElementById('score').innerHTML = (state.game.settings.points) + ' points';
	return asteroid;
}

function getShipPosition(state) {
	return {x: 620, y: 255};
}

function calcNewPosition(oldPos, state) {
	let shipPos = getShipPosition(state);
	let normFactor = Math.sqrt((shipPos.x - oldPos.x) * (shipPos.x - oldPos.x) +
		(shipPos.y - oldPos.y) * (shipPos.y - oldPos.y));
	if (normFactor >= 1) {
		let dx = (shipPos.x - oldPos.x) / normFactor * state.game.settings.moveSpeed;
		let dy = (shipPos.y - oldPos.y) / normFactor * state.game.settings.moveSpeed;

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

function pressedNotes(oldNotes, state, note) {
	console.log('Pressed note:', note);
	console.log('oldNotes', oldNotes);
	// TODO: possibly detect chord
	oldNotes.push(note);
	return oldNotes;
}

function changeAsteroid(state){
	let asteroid = state.game.asteroid;

	if (asteroid.chord == '0') return newAsteroid(state);

	asteroid.rot += Math.random()*5;

	if (state.pressedKeys.indexOf(asteroid.chord)>=0){
		state.game.settings.points += 100;
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

const playNote = note => (
	state => obj.patch(state, ['game', 'audio', 'pressed'], pressedNotes(state.game.audio.pressed, state, note))
);

const notesOff = () => (
	state => obj.patch(state, ['game', 'audio', 'pressed'], [])
);

module.exports = {
	initial,
	counter,
	set,
	toggle,
	arrToggle,
	rotate,
	moveAsteroid,
	playNote,
	notesOff
};
