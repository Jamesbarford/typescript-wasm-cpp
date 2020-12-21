const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const babelConfig = require("./babel.config");

const production = process.env.NODE_ENV === "production";
const development = process.env.NODE_ENV === "development";
const mode = development ? "development" : "production";

console.log(`Build ENV: ${mode.toUpperCase()}`);

const plugins = [
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    new HtmlWebpackPlugin({ template: "template.html" }),
    new webpack.HashedModuleIdsPlugin()
];

if (development) {
    plugins.push(
        new ForkTsCheckerWebpackPlugin({
            eslint: {
                enabled: true,
                files: "./src/*"
            }
        })
    );
}

if (production) {
    plugins.push(new CleanWebpackPlugin());
}

const WebpackConfig = {
    entry: ["core-js/stable", "./src/entry.tsx"],
    mode,
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "../dist-client"),
        publicPath: "/",
        pathinfo: !development
    },
    plugins,
    optimization: {
        runtimeChunk: "single",
        minimize: production,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        comparisons: false,
                        inline: 2,
                        loops: false
                    },
                    mangle: true,
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true
                    },
                    safari10: true
                },
                parallel: true,
                cache: true,
                sourceMap: true
            })
        ],
        splitChunks: {
            chunks: "all",
            minSize: 0,
            maxInitialRequests: Infinity,
            cacheGroups: 
                {
                      vendor: {
                          test: /[\\/]node_modules[\\/]/,
                          name: "vendor"
                      }
                  }
        }
    },
    devtool: development ? "inline-source-map" : "source-map",
    resolve: {
        extensions: [".js", ".json", ".ts", ".tsx"]
    },
    devServer: {
        contentBase: "./",
        compress: true,
        port: 5000,
        historyApiFallback: { disableDotRule: true },
        proxy: {
            "/api": {
                target: "http://[::1]:3000",
                secure: false,
                changeOrigin: false
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: babelConfig.presets,
                            plugins: babelConfig.plugins,
                            cacheDirectory: true
                        }
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader",  "sass-loader"]
            }
        ]
    }
};

module.exports = WebpackConfig;
