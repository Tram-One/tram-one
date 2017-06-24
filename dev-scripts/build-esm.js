const fs = require('fs')
const babel = require('babel-core')
const uglify = require('uglify-js')

const pkg = require('../package.json')

const tramBabel = babel.transformFileSync('./tram-one.js', {
  extends: './configs/.babelrc'
})
const tramUgly = uglify.minify(tramBabel.code)

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}
fs.writeFileSync(pkg.module, tramUgly.code)
