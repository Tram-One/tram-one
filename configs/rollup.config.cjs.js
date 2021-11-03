import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import pkg from '../package.json';
import typescript from '@rollup/plugin-typescript';

const plugins = [typescript(), commonjs(), filesize()];

export default {
	input: 'src/tram-one.ts',
	plugins,
	output: {
		file: pkg.commonjs,
		format: 'cjs',
		interop: 'auto',
		sourcemap: true,
	},
};
