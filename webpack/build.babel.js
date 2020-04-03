import path from "path";
import merge from "webpack-merge";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import JSObfuscator from "webpack-obfuscator";

import webpackConfig from "./base";
import paths from "./paths";
import commitHash from "./commit-hash";

export default merge(webpackConfig, {
  mode: "production",

  entry: {
    protected_main: "./src/index",
    assets_login: "./src/index-login",
    assets_onboarding: "./src/index-onboarding",
    assets_register: "./src/index-register",
  },

  output: {
    publicPath: "/",
    chunkFilename: "assets/chunk-[name]-[chunkhash].js",
    filename: asset => {
      const { id } = asset.chunk;
      const [folder, name] = id.split("_");
      return `${folder}/${name}-[chunkhash].js`;
    },
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
    new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
    new HtmlWebpackPlugin({
      commitHash: commitHash(),
      filename: "index-login.html",
      template: path.normalize(`${paths.src}/templates/default.html`),
      excludeChunks: ["protected_main", "assets_onboarding", "assets_register"],
    }),
    new HtmlWebpackPlugin({
      commitHash: commitHash(),
      filename: "index-onboarding.html",
      template: path.normalize(`${paths.src}/templates/default.html`),
      excludeChunks: ["protected_main", "assets_login", "assets_register"],
    }),
    new HtmlWebpackPlugin({
      commitHash: commitHash(),
      filename: "index-register.html",
      template: path.normalize(`${paths.src}/templates/default.html`),
      excludeChunks: ["protected_main", "assets_login", "assets_onboarding"],
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    ...(process.env.ANALYZE_BUNDLE ? [new BundleAnalyzerPlugin()] : []),
    new JSObfuscator({}, ["assets/chunk-**"]),
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
