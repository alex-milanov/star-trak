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
			moveSpeed: 1 //pixels per tick
		},
		asteroid:{
			pos: {x: 620, y: 50},
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

		// console.log('x', oldPos.x + dx, 'y', oldPos.y + dy);
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

function pressedNotes(oldNotes, state, note) {
	console.log('Pressed note:', note);
	console.log('oldNotes', oldNotes);
	// TODO: possibly detect chord	
	oldNotes.push(note);
	return oldNotes;
}

const moveAsteroid = () => (
	state => (obj.patch(
				obj.patch(state, ['game', 'asteroid', 'rot'], state.game.asteroid.rot + 0.5), 
				['game', 'asteroid', 'pos'], calcNewPosition(state.game.asteroid.pos, state))
			  )
);

const playNote = (note) => (
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
