const WebpackBabelExternalsPlugin = require('webpack-babel-external-helpers-2')

module.exports = {
  entry: './tests/specs/tram-spec.js',
  module: {
    rules: [
      {
        exclude: /domino/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackBabelExternalsPlugin()
  ],
  output: {
    filename: './tests/tram-spec.js'
  }
}
