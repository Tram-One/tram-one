const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

const plugins = [
  resolve({ main: true, preferBuiltins: true }),
  commonjs(),
  babel({
    presets: [
      'es2015-rollup'
    ]
  })
]

export default {
  entry: 'tests/specs/tram-spec.js',
  dest: 'tests/tram-spec.js',
  format: 'iife',
  plugins: plugins,
  sourceMap: true
}
