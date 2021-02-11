const path = require("path");
module.exports = {
  entry: {
    main: "./src/index.tsx",
  },
  output: {
    path: __dirname + "/bundle",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      { test: /\.(sa|sc|c)ss$/, use: "style-loader" },
      {
        test: /\.(sa|sc|c)ss$/,
        use: "css-loader",
      },
      {
        test: /\.scss$/,
        use: "sass-loader",
      },
      { exclude: /node_modules/, test: /\.(ts|tsx)$/, use: "ts-loader" },
    ],
  },
};
