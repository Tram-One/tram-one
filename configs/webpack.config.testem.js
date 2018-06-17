module.exports = {
  entry: './tests/browser-runner.js',
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
