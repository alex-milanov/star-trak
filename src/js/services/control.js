'use strict';

const keyboard = require('../util/keyboard');
const time = require('../util/time');
const {obj} = require('iblokz-data');

let detach = () => {};

const hook = ({state$, actions}) => {
	const pressedKeys$ = keyboard.watch(['left', 'right', 'up', 'down', 'shift']);

	const getDirection = keys => ([
		(keys.left || keys.a) && -1 || (keys.right || keys.d) && 1 || 0,
		0,
		(keys.up || keys.w) && 1 || (keys.down || keys.s) && -1 || 0
	]);

	const getForce = keys => (keys.shift && 6 || 4) * ((
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

	const keyNoteMap = {
		z: 'C',
		s: 'C#',
		x: 'D',
		d: 'D#',
		c: 'E',
		v: 'F',
		g: 'F#',
		b: 'G',
		h: 'G#',
		n: 'A',
		j: 'A#',
		m: 'B'
	};

	keyboard.watch(['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm'])
		.map(keys => (console.log(keys), keys))
		.map(keys => Object.keys(keys)
			.filter(key => keys[key])
			.map(key => keyNoteMap[key] + '4'))
		.subscribe(pressedKeys => actions.set('pressedKeys', pressedKeys));

	// const noteOff$ = keyboard.off('z');
	// .subscribe(())

	time.frame()
		.withLatestFrom(directionForce$, (t, df) => df)
		.filter(df => df.force > 0)
		.subscribe(df => actions.move(df.direction, df.force));

	let gameLoop = time.frame()
		.withLatestFrom(state$, (time, state) => ({time, state}))
		// .filter(({df}) => df.force > 0)
		.subscribe(({time, state}) => {
			actions.moveAsteroid();

			if (state.game.settings.lifes === 0) {
				actions.set(['game', 'ship', 'pos'], {
					x: state.viewport.screen.width / 2,
					y: state.viewport.screen.height / 2
				});
				actions.set(['game', 'settings', 'lifes'], 4);
			}
		});

	detach = () => {
		gameLoop.dispose();
	};
};

module.exports = {
	hook,
	detach
};
