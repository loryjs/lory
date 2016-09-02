import path from 'path';
import _debug from 'debug';

var ROOT_PATH = path.resolve(__dirname);

const debug = _debug('app:webpack:config');
debug('Create configuration.');

export const COMPILER_STATS = {
    chunks: true,
    chunkModules: true,
    colors: true
};

export const PORT = 8080;

export default {
    entry: {
        "lory": ["./src/lory.js"],
        "jquery.lory": "./src/jquery.lory.js"
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
        filename: '[name].min.js',
        libraryTarget: 'umd'
    },
    plugins: []
};
