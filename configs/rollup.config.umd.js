import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import globals from 'rollup-plugin-node-globals';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
// import sizes from 'rollup-plugin-sizes'

import pkg from '../package.json';

const plugins = [
	typescript(),
	resolve({
		preferBuiltins: true,
		browser: true,
	}),
	builtins(),
	commonjs(),
	globals(),
	builtins(),
	terser(),
	// sizes(), // useful for finding large dependencies
	filesize(),
];

export default {
	input: 'src/tram-one.ts',
	output: {
		name: 'tram-one',
		exports: 'named',
		file: pkg.umd,
		format: 'umd',
	},
	plugins,
};
