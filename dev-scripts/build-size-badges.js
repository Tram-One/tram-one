// generate svgs badges for build sizes
const path = require('path')
const fs = require('fs')
const badge = require('gh-badges')

const buildPath = 'dist' // where to find the badges
const destPath = 'docs/images' // where to story badges
const units = ['B', 'kB', 'MB', 'GB']

// get filesize and transform to correct unit
function getSize(fileName) {
  const bytes = fs.statSync(path.resolve(buildPath, fileName)).size
  const n = Math.floor(Math.log(bytes) / Math.log(1024))
  const formatted = (bytes / Math.pow(1024, n)).toFixed(2)
  return `${formatted} ${units[n]}`
}

// replace old svg
function save(svg, name) {
  const dest = path.resolve(destPath, `${name}.svg`)
  fs.writeFile(dest, String(svg), err => err && process.stdout.write(err))
}

// generate an SVG string
function generateBadge(label, value) {
  const format = {
    text: [label, value],
    colorscheme: 'red',
    template: 'flat'
  }

  badge(format, (svg, err) => {
    if (err) {
      process.stdout.write('Error generating build size badge', err)
    } else {
      save(svg, label)
    }
  })
}

generateBadge('esm', getSize('tram-one.esm.js'))
generateBadge('umd', getSize('tram-one.umd.js'))
