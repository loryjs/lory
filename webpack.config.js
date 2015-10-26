module.exports = {
    entry: {
        "lory": ["./src/lory.js"],
        "jquery.lory": "./src/jquery.lory.js"
    },

    module: {
        loaders: [{
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                stage: 0
            }
        }]
    },

    output: {
        path: __dirname + '/dist/',
        filename: '[name].js',
        library: 'lory',
        libraryTarget: 'umd'
    },

    devServer: {
        contentBase: "./demo",
        noInfo: true, //  --no-info option
        hot: true,
        inline: true
    }
}
