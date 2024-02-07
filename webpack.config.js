const path = require('path')
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  entry: [
    path.resolve(__dirname, './src/_assets/js/site.js'),
    path.resolve(__dirname, './src/_assets/css/site.css'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
    filename: 'site.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: { url: false },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin({}), new CssMinimizerPlugin()],
  },
  plugins: [
    new ProgressBarPlugin(),
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new MiniCssExtractPlugin({
      filename: 'site.css',
    }),
  ],
  mode: process.env.NODE_ENV,
}
