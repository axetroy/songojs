/**
 * Created by axetroy on 16-9-15.
 */

var webpack = require('webpack');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
var path = require('path');

// webpack.config.js
module.exports = {
  entry: {
    "songo": path.join(__dirname, 'index.ts')
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    library: 'songo',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.coffee', '.js', '.ts']
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: []
        }
      },
      {test: /\.tsx?$/, loader: 'ts-loader'}
    ]
  },
  plugins: [
/*    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      test: /\.min\.js$/
    })*/
  ]
};