import * as threadLoader from "thread-loader";
import webpack from "webpack";
import merge from "webpack-merge";

import paths from "./paths";
import webpackConfig from "./base";

threadLoader.warmup({}, ["babel-loader"]);

export default merge(webpackConfig, {
  devtool: "cheap-module-source-map",
  mode: "development",

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["thread-loader", "babel-loader"],
        exclude: /node_modules/,
      },
    ],
  },

  devServer: {
    contentBase: paths.dist,
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: true,
    publicPath: "/",
    overlay: true,
    host: "localhost",
    port: 9000,
    stats: "errors-only",
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
