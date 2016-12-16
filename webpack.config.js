const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname + '/src',
  devtool: 'source-map',
  entry: {
    app: './app.js',
    client: './client.scss'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js',
  },
  devServer: {
    contentBase: __dirname + '/src',
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'client.css',
      allChunks: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel',
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        use: [{
          loader: 'hson',
        }],
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          loader: 'css!postcss!resolve-url!sass?sourceMap'
        })
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        loader: 'file?name=images/[hash:7].[ext]'
      }
    ],
  },
};
