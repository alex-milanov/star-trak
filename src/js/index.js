'use strict';

// lib
const Rx = require('rx');
const $ = Rx.Observable;

// iblokz
const vdom = require('iblokz-snabbdom-helpers');
const {obj, arr} = require('iblokz-data');

// app
const app = require('./util/app');
let actions = app.adapt(require('./actions'));
let ui = require('./ui');
let actions$;
const state$ = new Rx.BehaviorSubject();

// services
let control = require('./services/control');
let audio = require('./services/audio');
let midi = require('./services/midi');
let viewport = require('./services/viewport');

// hot reloading
if (module.hot) {
	// actions
	actions$ = $.fromEventPattern(
    h => module.hot.accept("./actions", h)
	).flatMap(() => {
		actions = app.adapt(require('./actions'));
		return actions.stream.startWith(state => state);
	}).merge(actions.stream);
	// ui
	module.hot.accept("./ui", function() {
		ui = require('./ui');
		actions.stream.onNext(state => state);
	});
	// services
	// control
	module.hot.accept("./services/control", function() {
		console.log('updating control');
		control.detach();
		// console.log('updating render3d');
		control = require('./services/control');
		control.hook({state$, actions});
		// actions.set('needsRefresh', true);
		// state$.connect();
	});
	module.hot.accept("./services/audio", function() {
		console.log('updating audio');
		audio.detach();
		// console.log('updating render3d');
		audio = require('./services/audio');
		audio.hook({state$, actions});
		// actions.set('needsRefresh', true);
		// state$.connect();
	});
	module.hot.accept("./services/midi", function() {
		console.log('updating midi');
		midi.detach();
		// console.log('updating render3d');
		midi = require('./services/midi');
		midi.hook({state$, actions});
		// actions.set('needsRefresh', true);
		// state$.connect();
	});
} else {
	actions$ = actions.stream;
}

// actions -> state
actions$
	.startWith(() => actions.initial)
	.scan((state, change) => change(state), {})
	.map(state => (console.log(state), state))
	.subscribe(state => state$.onNext(state));

state$
	.distinctUntilChanged(state => state.pressedKeys + Object.assign({}, state.game, {asteroid: {}}))
	.subscribe(state => console.log(state));

// state -> ui
const ui$ = state$.map(state => ui({state, actions}));
vdom.patchStream(ui$, '#ui');

// hooks
control.hook({state$, actions});
audio.hook({state$, actions});
midi.hook({state$, actions});
viewport.hook({state$, actions});

// livereload impl.
if (module.hot) {
	document.write(`<script src="http://${(location.host || 'localhost').split(':')[0]}` +
	`:35729/livereload.js?snipver=1"></script>`);
}
