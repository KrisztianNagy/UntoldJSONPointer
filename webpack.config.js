const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [{ test: /\.pegjs$/, loader: 'pegjs-loader' }, { test: /\.ts$/, exclude: /node_modules/, loader: 'babel-loader' }]
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts', '.pegjs']
    },
    devtool: '#inline-cheap-module-source-map'
};
