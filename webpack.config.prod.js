import webpack from 'webpack';
import baseConfig from './webpack.config.base';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UnminifiedWebpackPlugin from 'unminified-webpack-plugin';
import _debug from 'debug';

const debug = _debug('app:webpack:config');
debug('Enable plugins for production (Dedupe & UglifyJS).');

let config = Object.create(baseConfig);

config.devtool = 'source-map';

config.plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    new UnminifiedWebpackPlugin()
];

export default config;
