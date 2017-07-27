'use strict';

var rollup = require('rollup');
var path = require('path');

var projectDir = path.resolve(__dirname, '..');
var libDir = path.join(projectDir, 'lib');
var testDir = path.join(projectDir, 'test');
var distDir = path.join(projectDir, 'dist');

rollup.rollup({
  entry: path.join(libDir, 'simple-dom.js'),
}).then(function (bundle) {
  return bundle.write({
    sourceMap: true,
    dest: path.join(distDir, 'simple-dom.js'),
    format: 'umd',
    moduleName: 'SimpleDOM'
  });
}).catch(function (e) {
  console.error(e);
  console.error(e.stack);
  process.exit(1);
});

rollup.rollup({
  entry: path.join(testDir, 'index.js'),

  plugins: [
    {
      name: 'resolve modules (local and from simple-html-tokenizer)',
      resolveId(id) {
        if (/^simple-dom/.test(id)) {
          return path.join(libDir, id + '.js');
        } else if (/^simple-html-tokenizer/.test(id)) {
          return path.join(projectDir, 'node_modules/simple-html-tokenizer/dist/es6/', id.replace('simple-html-tokenizer', '') + '.js');
        }
      },
    }
  ]
}).then(function (bundle) {
  return bundle.write({
    sourceMap: true,
    dest: path.join(distDir, 'simple-dom-test.js'),
    format: 'umd',
    moduleName: 'SimpleDOMTests'
  });
}).catch(function (e) {
  console.error(e);
  console.error(e.stack);
  process.exit(1);
});