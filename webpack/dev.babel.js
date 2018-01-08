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
    historyApiFallback: {
      disableDotRule: true
    },
    hot: true,
    // @TODO: issue with webpack-dev-server and https (lot of disconnections), wait for fix
    // https://github.com/webpack/webpack-dev-server/issues/941
    // https: true,
    publicPath: "/",
    overlay: true,
    host: "localhost",
    port: 9000,
    stats: "errors-only",
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
