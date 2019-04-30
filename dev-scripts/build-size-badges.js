const path = require('path')
const fs = require('fs')
const badge = require('./badge')

const buildPath = 'dist'
const destPath = 'docs/images'
const units = ['B', 'kB', 'MB', 'GB']

// get filesize and transform to correct unit
const getSize = (fileName) => {
  const bytes = fs.statSync(path.resolve(buildPath, fileName)).size
  const n = Math.floor(Math.log(bytes) / Math.log(1024))
  const formatted = (bytes / (1024 ** n)).toFixed(2)
  return `${formatted} ${units[n]}`
}

// generate an SVG string and write it to dest
const generateBadge = (label) => {
  const value = getSize(`tram-one.${label}.js`)
  const svg = badge(label, value)
  const dest = path.resolve(destPath, `${label}.svg`)
  fs.writeFile(dest, svg, err => err && process.stdout.write(err))
}

generateBadge('cjs')
generateBadge('umd')
