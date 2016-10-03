import webpack from 'webpack';
import _debug from 'debug';
import fs from 'fs-extra';
import config from '../webpack.config.prod.js';
import {COMPILER_STATS} from '../webpack.config.base.js';

const debug = _debug('app:build:webpack-compiler');

function webpackCompiler (webpackConfig, statsFormat = COMPILER_STATS) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);

    compiler.run((err, stats) => {
      const jsonStats = stats.toJson();

      debug('Webpack compile completed.');
      debug(stats.toString(statsFormat));

      if (err) {
        debug('Webpack compiler encountered a fatal error.', err);
        return reject(err);
      } else if (jsonStats.errors.length > 0) {
        debug('Webpack compiler encountered errors.');
        debug(jsonStats.errors.join('\n'));
        return reject(new Error('Webpack compiler encountered errors'));
      } else if (jsonStats.warnings.length > 0) {
        debug('Webpack compiler encountered warnings.');
        debug(jsonStats.warnings.join('\n'));
      } else {
        debug('No errors or warnings encountered.');
      }
      resolve(jsonStats);
    });
  });
}

;(async function () {
  try {
    debug('Run compiler');
    const stats = await webpackCompiler(config);
    if (stats.warnings.length && config.compiler_fail_on_warning) {
      debug('Config set to fail on warning, exiting with status code "1".');
      process.exit(1);
    }
  } catch (e) {
    debug('Compiler encountered an error.', e);
    process.exit(1);
  }
})();
