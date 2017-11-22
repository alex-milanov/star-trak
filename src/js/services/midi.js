'use strict';

const midi = require('../util/midi');

let detach = () => {};

const hook = ({state$, actions}) => {
	const midiSub = midi.init().msg$
		.map(raw => ({msg: midi.parseMidiMsg(raw.msg), raw}))
		.subscribe(({msg}) => actions.arrToggle('pressedKeys', msg.note.key + msg.note.octave));
	detach = () => {
		midiSub.detach();
	};
};

module.exports = {
	hook,
	detach
};
