import filesize from 'rollup-plugin-filesize'
import commonjs from 'rollup-plugin-commonjs'
import pkg from '../package.json'
import typescript from '@rollup/plugin-typescript'

const external = Object.keys(pkg.dependencies)
	.concat([
		'type/function/ensure',
		'type/object/ensure',
		'type/string/ensure',
		'type/value/ensure'
	])

const plugins = [
	typescript(),
	commonjs(),
	filesize()
]

export default {
	input: 'src/tram-one.ts',
	external,
	plugins,
	output: {
		file: pkg.commonjs,
		exports: 'named',
		format: 'cjs',
		interop: false
	}
}
