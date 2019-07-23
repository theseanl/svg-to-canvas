/**
 * convert.js "glob_to_svgs" "output_file_name"
 */

const fs = require('async-file');
const path = require('path');
const fg = require('fast-glob');
const puppeteer = require('puppeteer');
 
// Starts a local server
const express = require('express');
const port = 3000;

async function launchALocalServer() {
	const app = express();
	app.use(express.static(__dirname))
	
	return new Promise((resolve, reject) => {
		app.listen(port, (err) => {
			if (err) {
				console.error('server startup failed');
				console.error(err);
				reject(err);
			} else {
				console.info(`Listening to port ${port}!`);
				resolve();
			}
		});		
	});
}

// Loads the conversion page with puppeteer
async function loadConversionPage() {
	await launchALocalServer();
	const browser = await puppeteer.launch()
	const page = await browser.newPage();
	await page.goto(`http://localhost:${port}/index.html`);
	page.on('console', msg => console.log('PAGE LOG:', msg.text()));
	return { browser, page };
}

async function svgToCanvas(globToSvgs, outputFileName) {
	const [paths, _] = await Promise.all([fg(globToSvgs), loadConversionPage()]);
	const { browser, page } = _;
	const output = await Promise.all(paths.map(async (svgPath) => {
		console.log("Converting " + svgPath);
		const svgStr = await fs.readFile(svgPath, 'utf8');
		const fileName = path.parse(svgPath).name;
		
		try {		
			const converted = await page.evaluate(
				`convert_to_canvas_instructions(
					${JSON.stringify(fileName)},
					${JSON.stringify(svgStr)}
				)`
			);
			return converted;
		} catch (e) {
			console.error(`Error during canvg call for ${fileName}: `, e);
			return '';
		}
	}));
	console.log(`Writing ${outputFileName}...`);
	await Promise.all([
		fs.writeFile(outputFileName, output.join("\n")),
		browser.close()
	]);
}

module.exports = svgToCanvas;
