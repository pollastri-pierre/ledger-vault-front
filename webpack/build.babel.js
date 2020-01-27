import merge from "webpack-merge";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import webpack from "webpack";
import JSObfuscator from "webpack-obfuscator";

import webpackConfig from "./base";

export default merge(webpackConfig, {
  mode: "production",

  output: {
    filename: "[name]-[chunkhash].js",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers:
                process.env.CIRCLE_NODE_TOTAL || require("os").cpus().length,
            },
          },
          "babel-loader?sourceMap",
        ],
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        },
      },
    },
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.OccurrenceOrderPlugin(),
    ...(process.env.ANALYZE_BUNDLE ? [new BundleAnalyzerPlugin()] : []),
    new JSObfuscator({}, ["vendor-**.js"]),
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
    cachedAssets: false,
  },
});
