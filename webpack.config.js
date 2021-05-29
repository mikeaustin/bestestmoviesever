const webpack = require('webpack');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: BUILD_DIR
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: APP_DIR,
        loader: 'babel-loader'
      }, {
        test: /\.css$/,
        loader: 'style-loader'
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   use: [
      //     {
      //       loader: ImageMinimizerPlugin.loader,
      //       options: {
      //         severityError: "warning", // Ignore errors on corrupted images
      //         minimizerOptions: {
      //           plugins: ["mozjpeg"],
      //         },
      //       },
      //     },
      //   ],
      // },
    ]
  },
};
