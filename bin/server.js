import webpack from 'webpack';
import config from '../webpack.config.dev.js';
import _debug from 'debug';
import WebpackDevServer from 'webpack-dev-server';
import {COMPILER_STATS, PORT} from '../webpack.config.base.js';

const debug = _debug('app:server');

config.entry.app.unshift(`webpack-dev-server/client?http://localhost:${PORT}/`, "webpack/hot/dev-server");
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
    hot: true,
    stats: COMPILER_STATS
});

debug(`Start webpack-dev-server on port: ${PORT}`);
server.listen(PORT);
