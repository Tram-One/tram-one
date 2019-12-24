const filesize = require('rollup-plugin-filesize')
const commonjs = require('rollup-plugin-commonjs')
const pkg = require('../package.json')

const external = Object.keys(pkg.dependencies)
	.concat([
		'type/function/ensure',
		'type/object/ensure',
		'type/string/ensure',
		'type/value/ensure'
	])

const plugins = [
	commonjs(),
	filesize()
]

export default {
	input: 'src/tram-one',
	external,
	plugins,
	output: {
		file: pkg.commonjs,
		exports: 'named',
		format: 'cjs',
		interop: false
	}
}
