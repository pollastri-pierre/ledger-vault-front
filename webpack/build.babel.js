import HappyPack from "happypack";
import merge from "webpack-merge";
import webpack from "webpack";

import webpackConfig from "./base";

export default merge(webpackConfig, {
  output: {
    filename: "[name]-[chunkhash].js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "happypack/loader",
        // NOTE: until we upgrade to webpack 4. eip55 library uses ES6 shorcuts and needs to be parsed
        exclude(modulePath) {
          return (
            /node_modules/.test(modulePath) &&
            !/node_modules\/eip55/.test(modulePath)
          );
        }
      }
    ]
  },

  plugins: [
    new HappyPack({ loaders: ["babel-loader?sourceMap"], verbose: false }),

    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: m => /node_modules/.test(m.context)
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),

    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        screw_ie8: true,
        sequences: true,
        unused: true,
        warnings: false
      },
      output: {
        comments: false
      }
    })
  ],

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
