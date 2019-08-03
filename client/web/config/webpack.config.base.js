// Common Webpack configuration used by webpack.config.development and webpack.config.production

const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../build'),
        publicPath: '/',
    },
    node: {
        fs: 'empty',
    },
    resolve: {
        modules: [
            path.join(__dirname, '../src/client/scripts'),
            path.join(__dirname, '../src/client/assets'),
            path.join(__dirname, '../src/client/assets/javascripts'),
            'node_modules',
        ],
        alias: {
            models: path.join(__dirname, '../src/client/assets/javascripts/models'),
        },
        extensions: ['.js', '.jsx', '.json', '.scss'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch', // fetch API
        }),
        // new CompressionPlugin({
        //     filename: '[path].gz[query]',
        // }),
        // new webpack.optimize.LimitChunkCountPlugin({}),
        // Shared code
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "vendor",
        //     filename: "js/vendor.bundle.js",
        //     minChunks: Infinity
        // })
    ],
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: "vendors",
    //                 chunks: "all"
    //             }
    //         }
    //     }
    // },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, './src')],
                loader: 'babel-loader?cacheDirectory',
            },
            {
                test: /\.js$/,
                use: ['ify-loader'],
            },
            // JavaScript / ES6
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, '../src/client/assets/javascripts'),
                loader: 'babel-loader',
            },
            // Images
            // Inline base64 URLs for <=8k images, direct URLs for the rest
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url-loader',
                query: {
                    limit: 8192,
                    name: 'images/[name].[ext]?[hash]',
                },
            },
            // Fonts
            {
                test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                query: {
                    limit: 8192,
                    name: 'fonts/[name].[ext]?[hash]',
                },
            },
            // Svgs
            {
                test: /\.svg?$/,
                loader: 'raw-loader',
            },
            //Cssm
            {
                test: /\.cssm$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function() {
                                return [require('precss'), require('autoprefixer')];
                            },
                        },
                    },
                ],
            },
        ],
    },
};
