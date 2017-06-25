import uglify from 'rollup-plugin-uglify'

const babel = require('rollup-plugin-babel')
const filesize = require('rollup-plugin-filesize')

const pkg = require('../package.json')
const external = Object.keys(pkg.dependencies)

const plugins = [
  babel({
    presets: [
      'es2015-rollup'
    ]
  }),
  uglify(),
  filesize()
]

export default {
  entry: 'tram-one.js',
  external: external,
  dest: pkg.main,
  format: 'es',
  plugins: plugins,
  sourceMap: true
}
