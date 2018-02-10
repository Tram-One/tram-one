const babel = require('rollup-plugin-babel')
const filesize = require('rollup-plugin-filesize')
const pkg = require('../package.json')

const external = Object.keys(pkg.dependencies)

const plugins = [
  babel({
    presets: [
      ['env', {
        modules: false,
        targets: {
          node: '6'
        }
      }]
    ],
    plugins: ['external-helpers']
  }),
  filesize()
]

export default {
  input: 'tram-one.js',
  external: external,
  plugins: plugins,
  output: {
    sourcemap: true,
    format: 'es',
    file: pkg.module
  }
}
