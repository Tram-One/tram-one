module.exports = {
  entry: './tests/browser-runner.js',
  mode: 'development',
  module: {
    rules: [
      {
        exclude: /domino/
      }
    ]
  },
  output: {
    filename: './tests/bundled-spec.js'
  }
}
