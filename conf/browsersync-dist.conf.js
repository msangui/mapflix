const conf = require('./gulp.conf');
const config = require('config');
const proxyMiddleware = require('http-proxy-middleware');
const proxy = proxyMiddleware('/api', {
  target: `http://${config.get('express.host')}:${config.get('express.port')}/`,
  changeOrigin: true
});

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.dist
      ],
      middleware: [
        proxy
      ]
    },
    open: false
  };
};
