import webpack from 'webpack';
import baseConfig from './webpack.config.base';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import _debug from 'debug';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

let config = Object.create(baseConfig);

const debug = _debug('app:webpack:config');
debug('Enable plugins for live development (HMR, NoErrors).');

config.plugins = [
    new HtmlWebpackPlugin({
        template: 'src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
];

config.entry.app = [];

config.module.rules = config.module.rules.concat([
    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    },
    {
        test: /\.html$/,
        loader: 'html-loader'
    },
    {
        test: /\.(png|jpg)$/,
        loader: 'url-loader'
    }
]);

export default config;
