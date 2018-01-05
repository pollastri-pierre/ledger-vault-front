import HappyPack from "happypack";
import webpack from "webpack";
import merge from "webpack-merge";

import paths from "./paths";
import webpackConfig from "./base";

export default merge(webpackConfig, {
  devtool: "cheap-module-source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "happypack/loader",
        exclude: /node_modules/
      }
    ]
  },

  devServer: {
    contentBase: paths.dist,
    historyApiFallback: true,
    hot: true,
    // @TODO: issue with webpack-dev-server and https (lot of disconnections), wait for fix
    // https: true,
    publicPath: "/",
    overlay: true,
    host: "0.0.0.0",
    port: 9000,
    stats: {
      colors: true,
      chunks: false
    },
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },

  plugins: [
    new HappyPack({ loaders: ["babel-loader"], verbose: false }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});
