import path from "path";

export default {
  dist: path.resolve(__dirname, "../dist"),
  distAssets: path.resolve(__dirname, "../dist/assets"),
  nodeModules: path.resolve(__dirname, "../node_modules"),
  src: path.resolve(__dirname, "../src"),
  favicon: path.resolve(__dirname, "../src/assets/img/favicon.png"),
  config: path.resolve(__dirname, "../config"),
};
