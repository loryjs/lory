import webpack from 'webpack';
import baseConfig from './webpack.config.base';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

let config = Object.create(baseConfig);

config.plugins = [
    new HtmlWebpackPlugin({
        template: 'src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
];

config.module.loaders = config.module.loaders.concat([
    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    },
    {
        test: /\.html$/,
        loader: 'html'
    },
    {
        test: /\.(png|jpg)$/,
        loader: 'url'
    }
]);

export default config;
