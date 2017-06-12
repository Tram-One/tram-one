const webpack = require('webpack')

module.exports = {
  entry: './tram-one.js',
  module: {
    rules: [{
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }]
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
    filename: './dist/tram-one.js',
    // export to AMD, CommonJS, or window
    libraryTarget: 'umd',
    // the name exported to window
    library: 'tram-one'
  }
}
