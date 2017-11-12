'use strict';

const keyboard = require('../util/keyboard');
const time = require('../util/time');

const hook = ({state$, actions}) => {
	const pressedKeys$ = keyboard.watch(['left', 'right', 'up', 'down', 'shift', 'w', 'a', 's', 'd']);

	const getDirection = keys => ([
		(keys.left || keys.a) && -1 || (keys.right || keys.d) && 1 || 0,
		0,
		(keys.up || keys.w) && 1 || (keys.down || keys.s) && -1 || 0
	]);

	const getForce = keys => (keys.shift && 10 || 5) * ((
		keys.left || keys.right || keys.up || keys.down
		|| keys.a || keys.d || keys.w || keys.s
	) ? 1 : 0);

	const directionForce$ = pressedKeys$
		// .filter(keys => keys.up || keys.down || keys.left || keys.right)
		.map(keys => (console.log('keys', keys), keys))
		.map(keys => ({
			direction: getDirection(keys),
			force: getForce(keys)
		}));

	const getNote = keys => (
		keys.z && 'C' ||
		keys.x && 'D' ||
		keys.c && 'E' ||
		keys.v && 'F' ||
		keys.b && 'G' ||
		keys.n && 'A' ||
		keys.m && 'H' || '');

	const pressedNotes$ = keyboard.watch(['z', 'x', 'c', 'v', 'b', 'n', 'm']);
	const note$ = pressedNotes$
		.map(keys => (console.log('note keys', keys), keys))
		.map(keys => ({
			note: getNote(keys)
		}));

	let gameLoop = time.frame().withLatestFrom(state$, directionForce$, note$, (time, state, df, pn) => ({time, state, df, pn}))
		// .filter(({df}) => df.force > 0)
		.subscribe(({time, state, df, pn}) => {
			// move
			// rotate ship
			if (df.force > 0)
				actions.rotate(df.direction, df.force);
			if (pn.note && pn.note != '')
				console.log('Pressed note:', pn.note);
		});

	return () => {
		gameLoop.dispose();
	};
};

module.exports = {
	hook
};
