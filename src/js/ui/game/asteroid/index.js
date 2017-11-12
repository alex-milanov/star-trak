'use strict';

const {
	header, div, section,
	ul, li, a, h1, img, p,
	button, span
} = require('iblokz-snabbdom-helpers');

module.exports = ({pos = {x: 20, y: 30}, rot = 0, size = 48, frame = 1, model = 1}, chord = '') =>
	section('.asteroid', {
		style: {
			top: `${pos.y}px`,
			left: `${pos.x}px`,
			height: `${size}px`,
			width: `${size}px`,
			marginTop: `${size / 2}px`,
			marginLeft: `${size / 2}px`,
//			backgroundPosition: `${-frame * size}px 0`,
			backgroundImage: `url('assets/img/asteroid-0${model}.png')`,
			backgroundSize: `auto ${size}px`,
			transform: `rotate(${rot}deg)`
		}
	}, [
		span({
			style: {
				lineHeight: `${size}px`,
				transform: `rotate(${-rot}deg)`,
				fontSize: `${size * 0.4}px`,
				textShadow: `0px 0px 5px #333`,
				color: `#acf`,
				display: 'block',
				textAlign: 'center'
			}
		}, chord)
	]);
