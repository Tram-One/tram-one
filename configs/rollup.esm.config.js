const babel = require('rollup-plugin-babel')
const filesize = require('rollup-plugin-filesize')
const uglify = require('rollup-plugin-uglify')
const pkg = require('../package.json')

const external = Object.keys(pkg.dependencies)

const plugins = [
  babel({
    presets: [
      ['env', {
        modules: false,
        targets: {
          node: '4'
        }
      }]
    ],
    plugins: ['external-helpers']
  }),
  uglify(),
  filesize()
]

export default {
  entry: 'tram-one.js',
  external: external,
  dest: pkg.module,
  format: 'es',
  plugins: plugins,
  sourceMap: true
}
