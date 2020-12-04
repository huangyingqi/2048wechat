const webpack = require('webpack');
module.exports = env => {
    if (!env) {
        env = {};
    }
    let config ={
        entry: "./src/game/2048/game.ts",
        output: {
            filename: "../../2048/game.js"
        },
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
  return config
}