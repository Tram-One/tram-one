const webpack = require('webpack')
const pkg = require('../package.json')

module.exports = {
  entry: './tram-one.js',
  devtool: 'source-map',
  module: {
    rules: [
      { test: /_test\.js$/, loader: 'webpack-unassert-loader' },
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  ],
  output: {
    filename: pkg.main,
    // export to AMD, CommonJS, or window
    libraryTarget: 'umd',
    // the name exported to window
    library: 'tram-one'
  }
}
