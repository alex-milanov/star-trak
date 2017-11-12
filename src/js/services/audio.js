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
		volume: 0.14,
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

const noteOn = (synth, note, velocity) => {
	const now = audio.context.currentTime;
	const time = now + 0.0001;

	const freq = audio.noteToFrequency(note.key + note.octave);

	if (synth.vco) audio.stop(synth.vco);
	synth.vco = audio.start(audio.vco(Object.assign({}, synth.vcp.prefs, {freq})));
	synth.vco = audio.connect(synth.vco, synth.vca);

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

	synth.vca.through.gain.cancelScheduledValues(0);
	synth.vca.through.gain.setValueCurveAtTime(new Float32Array([synth.vca.through.gain.value, 0]),
			time, synth.vca.prefs.release > 0 && synth.vca.prefs.release || 0.00001);

	audio.stop(synth.vco, time + (synth.vca.prefs.release > 0 && synth.vca.prefs.release || 0.00001));
};

let detach = () => {};

const hook = ({state$, actions}) => {
	state$.subscribe(state => {
		audio.connect(bank.gameOver.output, audio.context.destination);
		audio.chain(synth.vco, synth.vca, synth.vcf, synth.reverb, audio.context.destination);
		// audio.start(bank.gameOver);
	});
};

module.exports = {
	hook,
	detach
};
