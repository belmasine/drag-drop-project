const path = require('path');

const CleanPugin = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    devtool: 'none',
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        // to clean up dist folder whenever we build project
        new CleanPugin.CleanWebpackPlugin()
    ]
}
