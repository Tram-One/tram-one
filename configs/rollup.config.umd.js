const builtins = require('rollup-plugin-node-builtins')
const commonjs = require('rollup-plugin-commonjs')
const filesize = require('rollup-plugin-filesize')
const globals = require('rollup-plugin-node-globals')
const resolve = require('rollup-plugin-node-resolve')
const { terser } = require('rollup-plugin-terser')
const typescript = require('@rollup/plugin-typescript')
// const sizes = require('rollup-plugin-sizes')

const pkg = require('../package.json')

const plugins = [
	typescript(),
	resolve({
		preferBuiltins: true,
		browser: true
	}),
	builtins(),
	commonjs(),
	globals(),
	builtins(),
	terser(),
	// sizes(), // useful for finding large dependencies
	filesize()
]

// domino is a package used by belit to support server side rendering,
// it does not need to be included in browser builds, which will have document
export default {
	input: 'src/tram-one.ts',
	external: ['domino'],
	output: {
		name: 'tram-one',
		exports: 'named',
		file: pkg.umd,
		globals: { domino: 'domino' },
		format: 'umd'
	},
	plugins
}
