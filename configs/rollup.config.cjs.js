const filesize = require('rollup-plugin-filesize')
const commonjs = require('rollup-plugin-commonjs')
const pkg = require('../package.json')

const external = Object.keys(pkg.dependencies)

const plugins = [
	commonjs(),
	filesize()
]

export default {
	input: 'src/tram-one/index.js',
	external,
	plugins,
	output: {
		file: pkg.commonjs,
		format: 'cjs',
		interop: false
	}
}
