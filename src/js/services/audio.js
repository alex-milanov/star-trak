'use strict';

const sampler = require('../util/audio/sources/sampler');
const audio = require('../util/audio');
const gameOverSound = sampler.create('assets/sound/game-over.flac');

let detach = () => {};

const hook = ({state$, actions}) => {
	state$.subscribe(state => {
		audio.connect(gameOverSound.output, audio.context.destination);
		// audio.start(gameOverSound);
	});
};

module.exports = {
	hook,
	detach
};
