const path = require("path");
module.exports = {
  entry: {
    "topicList": "./src/TopicList/index.tsx",
    "topicDetail": "./src//TopicDetail/index.tsx",
    "postTopic": "./src//PostTopic/index.tsx",
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
      // [style-loader](/loaders/style-loader)
      { test: /\.css$/, use: "style-loader" },
      // [css-loader](/loaders/css-loader)
      {
        test: /\.css$/,
        use: "css-loader",
      },
      { exclude: /node_modules/, test: /\.tsx$/, use: "ts-loader" },
    ],
  },
};
