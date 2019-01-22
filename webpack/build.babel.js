import merge from "webpack-merge";
import webpack from "webpack";

import webpackConfig from "./base";

export default merge(webpackConfig, {
  mode: "production",

  output: {
    filename: "[name]-[chunkhash].js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["thread-loader", "babel-loader?sourceMap"],
        exclude: /node_modules/
      }
    ]
  },

  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial"
        }
      }
    }
  },

  plugins: [new webpack.optimize.OccurrenceOrderPlugin()],

  stats: {
    colors: true,
    reasons: false,
    hash: false,
    version: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    cached: false,
    cachedAssets: false
  }
});
