import uglify from 'rollup-plugin-uglify'

const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

const pkg = require('../package.json')
const external = Object.keys(pkg.dependencies)

const plugins = [
  resolve({ main: true, preferBuiltins: true }),
  commonjs(),
  babel({
    presets: [
      'es2015-rollup'
    ]
  }),
  uglify()
]

export default {
  entry: 'tram-one.js',
  external: external,
  dest: pkg.main,
  format: 'umd',
  plugins: plugins,
  moduleName: 'tram-one',
  sourceMap: true
}
