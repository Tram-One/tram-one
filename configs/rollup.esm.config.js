import uglify from 'rollup-plugin-uglify'

const babel = require('rollup-plugin-babel')

const pkg = require('../package.json')
const external = Object.keys(pkg.dependencies)

const plugins = [
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
  dest: pkg.module,
  format: 'es',
  plugins: plugins,
  sourceMap: true
}
