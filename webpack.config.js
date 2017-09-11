const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './public/javascripts/figment-app.js',
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/, 
                use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "sass-loader"],
                publicPath: path.resolve(__dirname, 'public/dist')
              })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("style.bundle.css")
    ]
} 