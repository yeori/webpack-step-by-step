const path = require("path");
const commonConfig = require("./webpack.config");
const { merge } = require("webpack-merge");
module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./js/main.[contenthash].js",
  },
});
