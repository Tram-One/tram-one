module.exports = {
  entry: './tests/specs/tram-spec.js',
  module: {
    rules: [
      {
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  output: {
    filename: './tests/tram-spec.js'
  }
}
