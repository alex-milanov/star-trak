'use strict';

const sampler = require('../util/audio/sources/sampler');
const audio = require('../util/audio');

const bank = {
	starTrakMusic: sampler.create('assets/sound/star-track-music.ogg'),
	menuClick1: sampler.create('assets/sound/menu-click-1.ogg'),
	laserCanon01: sampler.create('assets/sound/laser-canon-01.ogg'),
	laserCanon02: sampler.create('assets/sound/laser-canon-02.ogg'),
	laserCanon03: sampler.create('assets/sound/laser-canon-03.ogg'),
	laserCanon04: sampler.create('assets/sound/laser-canon-04.ogg'),
	gameOver: sampler.create('assets/sound/game-over.ogg'),
	engineSystemsStartup: sampler.create('assets/sound/engine-systems-startup.ogg'),
	engineAmb: sampler.create('assets/sound/engine-amb.ogg')
};

const synth = {
	vco: audio.vco({
		on: true,
		type: 'square',
		detune: -3
	}),
	vca: audio.vca({
		volume: 1,
		attack: 0.19,
		decay: 0.55,
		sustain: 0.5,
		release: 0.43
	}),
	vcf: audio.vcf({
		on: true,
		cutoff: 0.51,
		resonance: 0.14,
		gain: 0
	}),
	reverb: audio.create('reverb', {
		on: true,
		wet: 0.8,
		dry: 0.7
	})
};

let voices = {};

const noteOn = (synth, note, velocity) => {
	const now = audio.context.currentTime;
	const time = now + 0.0001;

	const freq = audio.noteToFrequency(note);

	let voice = voices[note] || false;

	if (voice) audio.stop(voice);
	voice = audio.vco({
		on: true,
		type: 'square',
		detune: -3,
		freq
	});
	voice = audio.start(voice);
	voice = audio.connect(voice, synth.vca);

	voices[note] = voice;

	synth.vca.through.gain.cancelScheduledValues(0);

	const vca1Changes = [].concat(
		// attack
		(synth.vca.prefs.attack > 0)
			? [[0, time], [velocity * synth.vca.prefs.volume, synth.vca.prefs.attack]]
			: [[velocity * synth.vca.prefs.volume, now]],
		// decay
		(synth.vca.prefs.decay > 0)
			? [[synth.vca.prefs.sustain * velocity * synth.vca.prefs.volume, synth.vca.prefs.decay]] : []
	).reduce((a, c) => [[].concat(a[0], c[0]), [].concat(a[1], c[1])], [[], []]);

	audio.schedule(synth.vca, 'gain', vca1Changes[0], vca1Changes[1]);
};

const noteOff = (synth, note, velocity) => {
	const now = audio.context.currentTime;
	const time = now + 0.0001;

	let voice = voices[note] || false;
	if (voice) {
		synth.vca.through.gain.cancelScheduledValues(0);
		synth.vca.through.gain.setValueCurveAtTime(new Float32Array([synth.vca.through.gain.value, 0]),
				time, synth.vca.prefs.release > 0 && synth.vca.prefs.release || 0.00001);

		audio.stop(voice, time + (synth.vca.prefs.release > 0 && synth.vca.prefs.release || 0.00001));
		setTimeout(() => {
			delete voices[note];
		});
	}
};

let detach = () => {};

const hook = ({state$, actions}) => {
	audio.connect(bank.gameOver.output, audio.context.destination);
	audio.chain(synth.vca, synth.vcf, synth.reverb, audio.context.destination);
	// audio.start(bank.gameOver);
	state$.subscribe(state => {

	});

	state$
		.distinctUntilChanged(state => state.pressedKeys)
		// .map(state => (console.log(state), state))
		// .filter(state => state.game.pressedKeys.length > 0)
		.map(state => state.pressedKeys)
		.subscribe(pressedKeys => {
			pressedKeys.filter(note => !voices[note])
				.forEach(
					note => noteOn(synth, note, 0.7)
				);
			Object.keys(voices).filter(note => pressedKeys.indexOf(note) === -1)
				.forEach(
					note => noteOff(synth, note, 0.7)
				);
		});
};

module.exports = {
	hook,
	detach
};
