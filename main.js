#!/usr/bin/env node

let args = process.argv.slice(2);
let {length} =args 
let outputFileName = args[length - 1];
let globs = args.slice(0, -1);

require('./convert.js')(globs, outputFileName)
	.then(() => {
		console.error('Done.');
		process.exit(0);
	})
	.catch((e) => {
		console.error('Unexpected error');
		console.error(e.stack);
		process.exit(1);
	});
