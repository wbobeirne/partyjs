module.exports = {
  entry: "./src",
  output: {
    path: "./dist",
    filename: "index.js",
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
    }],
  },
};
