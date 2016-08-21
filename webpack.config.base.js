import path from 'path';

var ROOT_PATH = path.resolve(__dirname);

export default {
    entry: {
        "lory": ["./src/lory.js"],
        "jquery.lory": "./src/jquery.lory.js",
        "app": []
    },
    module: {
        loaders: [
            {
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }
        ]
    },
    output: {
        path: path.resolve(ROOT_PATH, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    plugins: []
};
