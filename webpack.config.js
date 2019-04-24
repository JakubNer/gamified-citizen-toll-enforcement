const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false }
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  mode: "none",
  resolve: {
    extensions: ['.js', '.jsx']
  },  
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};