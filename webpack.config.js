var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

// Manually add the native Phantom JS modules used in the project
nodeModules['webpage'] = 'commonjs webpage';

module.exports = {
  entry: './crawler.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'main.js'
  },
  externals: nodeModules,
  node: {
    __dirname: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
