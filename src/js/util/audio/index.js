'use strict';

const {obj, fn} = require('iblokz-data');

const {
	context, set, isSet, isGet,
	create: _create,
	connect: _connect, disconnect: _disconnect
} = require('./core');

const reverb = require('./effects/reverb');

const create = (type, ctx = context) => Object.assign({},
	obj.switch(type, {
		vco: () => ({output: _create('oscillator')}),
		vca: () => ({through: _create('gain')}),
		vcf: () => ({through: _create('biquadFilter')}),
		reverb: () => reverb.create()
	})(),
	{type, out: []}
);

const cutoffToFreq = cutoff => {
	const minValue = 40;
	const maxValue = context.sampleRate / 2;
	// Logarithm (base 2) to compute how many octaves fall in the range.
	var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
	// Compute a multiplier from 0 to 1 based on an exponential scale.
	var multiplier = Math.pow(2, numberOfOctaves * (cutoff - 1.0));
	// Get back to the frequency value between min and max.
	return maxValue * multiplier;
};

const update = (node, prefs) => obj.switch(node.type, {
	vco: () => (
		isSet(prefs.type) && set(node.output, 'type', prefs.type),
		isSet(prefs.freq) && set(node.output.frequency, 'value', prefs.freq),
		isSet(prefs.detune) && set(node.output.detune, 'value', prefs.detune),
		Object.assign(node, {prefs})
	),
	vca: () => (
		isSet(prefs.gain) && set(node.through.gain, 'value', prefs.gain),
		Object.assign(node, {prefs})
	),
	vcf: () => (
		isSet(prefs.type) && set(node.through, 'type', prefs.type),
		isSet(prefs.cutoff) && set(node.through.frequency, 'value', cutoffToFreq(prefs.cutoff)),
		isSet(prefs.resonance) && set(node.through.Q, 'value', prefs.resonance * 30),
		Object.assign(node, {prefs})
	),
	reverb: () => reverb.update(node, prefs)
})();

const connect = (node1, node2) => !(node1.out && node1.out.indexOf(node2) > -1)
	? (_connect(
			// input
			isGet(node1.output)
			|| isGet(node1.through)
			|| isSet(node1.connect) && node1,
			// output
			isGet(node2.input)
			|| isGet(node2.through)
			|| node2
		),
		Object.assign({}, node1, {
			out: [].concat(node1.out, [node2])
		}))
	: node1;

const disconnect = (node1, node2) => (console.log(node1, node2), (node1.out.indexOf(node2) > -1)
	? (_disconnect(
			// input
			isGet(node1.output)
			|| isGet(node1.through)
			|| isSet(node1.connect) && node1,
			// output
			isGet(node2.input)
			|| isGet(node2.through)
			|| node2
		),
		Object.assign({}, node1, {
			out: [].concat(
				node1.out.slice(0, node1.out.indexOf(node2)),
				node1.out.slice(node1.out.indexOf(node2) + 1)
			)
		}))
	: (typeof node2 === 'undefined')
		&& node1.out.reduce((node1, prevNode) => disconnect(node1, prevNode), node1)
		|| node1);

const reroute = (node1, node2) => (node1.out && node1.out.indexOf(node2) === -1)
	? connect(disconnect(node1), node2)
	: node1;

const chain = (...nodes) => (
	nodes.forEach((n, i) => isSet(n[i + 1]) && connect(n, nodes[i + 1])),
	nodes[0]
);

const unchain = (...nodes) => (
	nodes.slice().reverse()
		.forEach((n, i) => isSet(n[i - 1]) && disconnect(nodes[i - 1], n)),
	nodes[0]
);

const start = (node, ...args) => (node.output.start(...args), node);

const stop = (node, ...args) => (node.output.stop(...args), node);

const schedule = (node, pref, values, times) => (values.length === 1)
	? node.through[pref].setValueAtTime(values[0], times[0])
	: (node.through[pref].setValueCurveAtTime(new Float32Array(values.slice(0, 2)), times[0], times[1]),
		(values.length > 2) && schedule(node, pref, values.slice(1), [times[0] + times[1]].concat(times.slice(2))));

const noteToFrequency = function(note) {
	var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	var keyNumber;
	var octave;

	if (note.length === 3) {
		octave = note.charAt(2);
	} else {
		octave = note.charAt(1);
	}

	keyNumber = notes.indexOf(note.slice(0, -1));

	if (keyNumber < 3) {
		keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
	} else {
		keyNumber = keyNumber + ((octave - 1) * 12) + 1;
	}

	return 440 * Math.pow(2, (keyNumber - 49) / 12);
};

module.exports = {
	context,
	create,
	update,
	schedule,
	connect,
	disconnect,
	reroute,
	chain,
	unchain,
	noteToFrequency,
	start,
	stop,
	vco: prefs => update(create('vco', context), prefs),
	vcf: prefs => update(create('vcf', context), prefs),
	lfo: prefs => update(create('lfo', context), prefs),
	vca: prefs => update(create('vca', context), prefs)
};
