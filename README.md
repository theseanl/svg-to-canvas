# svg-to-canvas-2d

A command line tool for converting static SVGs into Javascript canvas API calls.

Based on [svg2canvas by samsha](https://github.com/samsha/svg2canvas), which is again based on [canvg](https://github.com/canvg/canvg). It uses puppeteer and applies does code formatting to automate and batch process conversion. Note that sometimes a bug of canvg leads to canvas API calls with defects, so users should manually verify that the resulting JS draws what is expected.

## Installation

```
yarn install
```

## Usage

```
svg-to-canvas [glob_of_svg_files[,glob2[, ...]]] [output_file_name]
```
```
// output.js - one line per file, ./path/to/svg_file.svg is converted to:
var svg_file = function (ctx) { ctx.save(); /* ... */ ctx.restore(); };
```
