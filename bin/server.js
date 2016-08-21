import webpack from 'webpack';
import config from '../webpack.config.dev.js';
import WebpackDevServer from 'webpack-dev-server';

config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
    hot: true
});

server.listen(8080);
