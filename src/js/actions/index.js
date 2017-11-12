'use strict';

const {obj, arr} = require('iblokz-data');

// namespaces=
const counter = require('./counter');

// initial
const initial = {
	viewport: {
		screen: {
			width: 0,
			height: 0
		}
	},
	game: {
		ship: {
			rot: 0,
			pos: {x: 0, y: 0}
		},
		audio: {
			note: 'a',
			pressed: []
		},
		settings: {
			moveSpeed: 1,
			lifes: 0,
			points: 0
		},
		asteroid: {
			pos: {x: 620, y: 50},
			chord: '0',
			frame: 0,
			rot: 0,
			hited: false
		}
	},
	pressedKeys: []
};

const degreeToRadiant = deg => Math.PI / (180 / deg);

// actions
const set = (key, value) => state => obj.patch(state, key, value);
const toggle = key => state => obj.patch(state, key, !obj.sub(state, key));
const arrToggle = (key, value) => state =>
	obj.patch(state, key,
		arr.toggle(obj.sub(state, key), value)
	);

const move = (direction, force) => (
	state => obj.patch(state, ['game', 'ship'], {
		rot: (state.game.ship.rot + direction[0] * force) % 360,
		pos: {
			x: state.game.ship.pos.x + Math.cos(degreeToRadiant((state.game.ship.rot - 90) % 360)) * direction[2] * force,
			y: state.game.ship.pos.y + Math.sin(degreeToRadiant((state.game.ship.rot - 90) % 360)) * direction[2] * force
		}
	}));

function crashShip(state) {
	if (state.game.settings.lifes > 0)
		--state.game.settings.lifes;
		// window.alert('You are dead!!!');
}

function getShipPosition(state) {
	return {x: state.viewport.screen.width / 2 - 32, y: state.viewport.screen.height / 2 - 32};
}

function newAsteroid(state) {
	const allChords = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
	const idx = Math.floor(Math.random() * 7);
	let asteroid = state.game.asteroid;
	asteroid.pos = {
		x: Math.random() * state.viewport.screen.width,
		y: Math.random() * state.viewport.screen.height
	};
	asteroid.chord = allChords[idx];
	asteroid.hited = false;
	asteroid.size = 32 + Math.random() * 64;
	asteroid.speed = 0.7 + Math.random() * 2;
	asteroid.model = 1 + Math.floor(Math.random() * 3);

	return asteroid;
}

function calcNewPosition(oldPos, state) {
	let shipPos = state.game.ship.pos;
	let normFactor = Math.sqrt((shipPos.x - oldPos.x) * (shipPos.x - oldPos.x) +
		(shipPos.y - oldPos.y) * (shipPos.y - oldPos.y));
	if (normFactor >= 1) {
		let dx = (shipPos.x - oldPos.x) / normFactor * state.game.asteroid.speed;
		let dy = (shipPos.y - oldPos.y) / normFactor * state.game.asteroid.speed;

		return {
			x: oldPos.x + dx,
			y: oldPos.y + dy
		};
	}

	crashShip(state);
	return {x: 0, y: 0};
}

function pressedNotes(oldNotes, state, note) {
	console.log('Pressed note:', note);
	console.log('oldNotes', oldNotes);
	// TODO: possibly detect chord
	oldNotes.push(note);
	return oldNotes;
}

function changeAsteroid(state) {
	let asteroid = state.game.asteroid;

	if (asteroid.hited || asteroid.chord === '0') return newAsteroid(state);

	asteroid.rot = (asteroid.rot + Math.random() * 5 * asteroid.speed * 0.7) % 360;

	if (state.pressedKeys.indexOf(asteroid.chord) >= 0) {
		asteroid.hited = true;
		state.game.settings.points += 100;
		return asteroid;
	}

	asteroid.pos = calcNewPosition(asteroid.pos, state);
	if (asteroid.pos.y < 4)
		return newAsteroid(state);
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
	move,
	moveAsteroid,
	playNote,
	notesOff
};
