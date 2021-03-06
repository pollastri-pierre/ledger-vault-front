import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

import paths from "./paths";
import * as globals from "./globals";

export default {
  entry: ["babel-polyfill", "./src/index"],

  resolve: {
    modules: [paths.src, paths.nodeModules]
  },

  output: {
    path: paths.dist,
    filename: "bundle.js",
    publicPath: "/"
  },

  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              hash: "sha512",
              digest: "hex",
              name: "[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              minetype: "application/font-woff",
              name: "[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[hash].[ext]"
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      ...Object.keys(globals).reduce((acc, key) => {
        acc[key] = JSON.stringify(globals[key]);
        return acc;
      }, {}),
      "process.env.NODE_ENV": JSON.stringify(globals.__ENV__)
    }),

    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),

    new HtmlWebpackPlugin({
      title: "Ledger Vault",
      template: path.normalize(`${paths.src}/templates/layout.html`)
    })
  ]
};
