module.exports = {
    entry: {
        "lory": ["./src/lory.js"],
        "jquery.lory": "./src/jquery.lory.js"
    },

    module: {
        loaders: [{
            exclude: /(node_modules|bower_components)/,
            loader: 'babel'
        }]
    },

    output: {
        path: __dirname + '/dist/',
        filename: '[name].js',
        libraryTarget: 'umd'
    },

    devServer: {
        contentBase: "./demo",
        open: true,
        port: 3333,
        hot: true,
        inline: true
    }
}
