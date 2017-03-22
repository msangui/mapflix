const conf = require('./gulp.conf');
const serverConf = require('./server.conf');
const url = require('url');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const proxy = proxyMiddleware('/api', {
  target: `http://${serverConf.host}:${serverConf.port}/`,
  changeOrigin: true
});

const webpackConf = require('./webpack.conf');
const webpackBundler = webpack(webpackConf);


module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ],
      middleware: [
        webpackDevMiddleware(webpackBundler, {
          // IMPORTANT: dev middleware can't access config, so we should
          // provide publicPath by ourselves
          publicPath: webpackConf.output.publicPath,

          // Quiet verbose output in console
          quiet: true
        }),

        // bundler should be the same as above
        webpackHotMiddleware(webpackBundler),
        proxy
      ]
    },
    open: false
  };
};
