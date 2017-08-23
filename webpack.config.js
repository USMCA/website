const webpack = require('webpack'),
      path = require('path'),
      SRC_DIR = path.resolve(__dirname, 'src')
      BUILD_DIR = path.resolve(__dirname, 'public/assets/js'),

module.exports = {
  entry: {
    index: path.resolve(SRC_DIR, 'index.js')
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel-loader'
      }
    ]
  }
}
