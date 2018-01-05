import HappyPack from "happypack";
import webpack from "webpack";
import merge from "webpack-merge";

import paths from "./paths";
import webpackConfig from "./base";

export default merge(webpackConfig, {
  devtool: "eval",

  entry: {
    app: [
      "webpack-dev-server/client?https://localhost:9000",
      "webpack/hot/only-dev-server",
      "react-hot-loader/patch",
      ...webpackConfig.entry
    ]
  },

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
    //hot: true,
    https: true,
    port: 9000,
    publicPath: "/"
  },

  plugins: [
    new HappyPack({ loaders: ["babel-loader"], verbose: false }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});
