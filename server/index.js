const express = require('express');
const cluster = require('cluster');
const compression = require('compression');
const app = express();
const config = require('config');
const serveStatic = require('serve-static');
const movies = require('./movies/routes');
const people = require('./people/routes');

const cpus = require('os').cpus().length;
if (cluster.isMaster) {
  for (var i = 0; i < cpus; i++) {
    // Create a worker
    cluster.fork();
  }
} else {
  // Workers share the TCP connection in this server
  app.use(compression());

  app.use('/api/movies', movies);
  app.use('/api/people', people);

  app.use(serveStatic(config.get('static.dirName')));

  app.listen(process.env.PORT || config.get('express.port'), () => {
    console.log(`Listening to port ${process.env.PORT || config.get('express.port')}`)
  });

}
