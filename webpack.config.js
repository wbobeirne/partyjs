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
      options: {
        presets: ["latest", "stage-3"],
      }
    }],
  },
};
