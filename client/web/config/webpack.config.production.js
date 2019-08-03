const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const config = require("./webpack.config.base");

const GLOBALS = {
    "process.env": {
        NODE_ENV: JSON.stringify("production")
    },
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || "false")),
    PRODUCTION: JSON.stringify(true)
};

module.exports = merge(config, {
    devtool: "source-map",
    entry: {
        application: ["babel-polyfill", "production"],
        vendor: [
            "react",
            "react-dom",
            "react-redux",
            "react-router",
            "react-router-redux",
            "redux"
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, "../src/client/assets/images"),
                to: "images"
            }
        ]),
        // Avoid publishing files when compilation fails
        //new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin(GLOBALS),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //         screw_ie8: true
        //     },
        //     output: {
        //         comments: false
        //     },
        //     sourceMap: true
        // }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        /*new BundleAnalyzerPlugin({
            analyzerPort: 3003,
            generateStatsFile: true
        })*/
    ],
    module: {
        // noParse: /\.min\.js$/,
        rules: [
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            // Sass
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, "../src/client/assets/javascripts"),
                    path.resolve(__dirname, "../src/client/assets/styles"),
                    path.resolve(__dirname, "../src/client/scripts")
                ],
                loaders: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "sass-loader",
                        query: { outputStyle: "expanded" }
                    }
                ]
            },
            // CSS
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader", "postcss-loader"]
            }
        ]
    }
});
