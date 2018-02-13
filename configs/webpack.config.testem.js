module.exports = {
  entry: './tests/specs/tram-spec.js',
  module: {
    rules: [
      {
        exclude: /domino/,
        use: {
          loader: 'buble-loader',
          options: {
            transforms: {templateString: false}
          }
        }
      }
    ]
  },
  output: {
    filename: './tests/tram-spec.js'
  }
}
