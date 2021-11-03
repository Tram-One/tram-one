import filesize from 'rollup-plugin-filesize';
import dts from 'rollup-plugin-dts';
// import esbuild from 'rollup-plugin-esbuild';

import pkg from '../load-package.cjs';
import typescript from '@rollup/plugin-typescript';

export default [
	{
		input: 'src/tram-one.ts',
		plugins: [typescript(), filesize()],
		output: {
			file: pkg.module,
			format: 'es',
			sourcemap: true,
		},
	},
	{
		input: 'src/tram-one.ts',
		plugins: [dts()],
		output: {
			file: pkg.types,
			format: 'es',
		},
	},
];
