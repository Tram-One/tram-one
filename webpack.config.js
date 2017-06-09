module.exports = {
  entry: './tram-one.js',
  output: {
    filename: './dist/tram-one.js',
    // export to AMD, CommonJS, or window
    libraryTarget: 'umd',
    // the name exported to window
    library: 'tram-one'
  }
}
