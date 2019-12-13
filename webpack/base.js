import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

import pkg from "../package.json";
import paths from "./paths";
import * as globals from "./globals";

// get git info from command line
let commitHash = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString();

commitHash = commitHash.substring(0, commitHash.length - 1);
export default {
  entry: "./src/index",

  resolve: {
    modules: [paths.src, paths.nodeModules],
  },

  output: {
    path: paths.dist,
    filename: "bundle.js",
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /locales/,
        loader: "@alienfast/i18next-loader",
        include: path.resolve(__dirname, "../locales"),
        options: {
          basenameAsNamespace: true,
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              hash: "sha512",
              digest: "hex",
              name: "[hash].[ext]",
            },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              minetype: "application/font-woff",
              name: "[hash].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[hash].[ext]",
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: paths.config,
        to: paths.dist,
        force: true,
      },
      {
        from: paths.favicon,
        to: paths.dist,
        force: true,
      },
    ]),
    new webpack.DefinePlugin({
      ...Object.keys(globals).reduce((acc, key) => {
        acc[key] = JSON.stringify(globals[key]); // eslint-disable-line
        return acc;
      }, {}),
      VAULT_FRONT_VERSION: JSON.stringify(pkg.version),
      "process.env.NODE_ENV": JSON.stringify(globals.__ENV__),
      "process.env.NOTIFICATION_URL": JSON.stringify(
        process.env.NOTIFICATION_URL,
      ),
      "process.env.NOTIFICATION_PATH": JSON.stringify(
        process.env.NOTIFICATION_PATH,
      ),
      "process.env.ORGANIZATION_NAME": JSON.stringify(
        process.env.ORGANIZATION_NAME,
      ),
    }),

    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new HtmlWebpackPlugin({
      title: "Ledger Vault",
      commitHash,
      template: path.normalize(`${paths.src}/templates/layout.html`),
    }),
  ],
};
