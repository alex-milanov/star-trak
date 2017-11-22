'use strict';

const path = require('path');
const fs = require('fs');
const sass = require('node-sass');

const includePaths = [].concat(
	require('bourbon').includePaths,
	require('bourbon-neat').includePaths,
	path.resolve(__dirname, '..', 'node_modules/font-awesome/scss')
);

// process.stdout.write(paths.join(':'));
const file = path.resolve(__dirname, '../src/sass/style.sass');
const outFile = path.resolve(__dirname, '../dist/css/style.css');

sass.render({
	file,
	includePaths,
	outFile
}, function(error, result) { // node-style callback from v3.0.0 onwards
	// console.log(error, result);
	if (!error) {
		// No errors during the compilation, write this result on the disk
		fs.writeFile(outFile, result.css, function(err) {
			if (!err) {
					// file written on disk
			}
		});
	}
});
