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

	let rotateSub = time.frame().withLatestFrom(directionForce$, (t, df) => df)
		.filter(({force}) => force > 0)
		.subscribe(({direction, force}) => actions.rotate(direction, force));

	return () => {
		rotateSub.dispose();
	};
};

module.exports = {
	hook
};
