const path = require('path');
var glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: glob.sync('./test/**.test.ts'),
    module: {
        rules: [{ test: /\.pegjs$/, loader: 'pegjs-loader' }, { test: /\.ts$/, exclude: /node_modules/, loader: 'babel-loader' }]
    },
    output: {
        filename: 'test.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts', '.pegjs']
    },
    devServer: {
        contentBase: './dist'
    },
    devtool: '#inline-cheap-module-source-map',
    watch: true,
    plugins: [
        new CopyWebpackPlugin([
            {
                from: './*.html'
            }
        ])
    ]
};
