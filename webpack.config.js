const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require("path");

module.exports = env => {
    if (!env) {
        env = {};
    }
    
    let config ={
        // entry: "./src/ddz/game.ts",
        // entry: "./src/game/huarongdao/game.ts",
        // entry: "./src/game/index.ts",
        entry: "./src/game/2048/game.ts",
        output: {
            // path: __dirname + "../2048",
            // path: __dirname + "/games",//打包后的文件存放的地方
            // filename: "./ddz.js"
            // filename: "../games/huarongdao.js"
            // filename: "../games/index.js"
            filename: "../../2048/game.js"
        },
        // Enable sourcemaps for debugging webpack's output.
        // devtool: "inline-source-map",
        resolve: {
            // Add '.ts' as resolvable extensions.
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: {
                        loader: "ts-loader",
                    },
                    exclude: /node_modules/
                }
            ]
        },
        devtool: 'source-map',
        plugins:[
            new webpack.DefinePlugin({
                'IS_WX': JSON.stringify(!!env.wx)
            })

        ]
    }  

    if(!env.wx){
        config.plugins.push(new HtmlWebpackPlugin())
    }

    return config
    
  }