const express = require('express');
const app = express();
const config = require('config');
const serveStatic = require('serve-static');
const movies = require('./movies/routes');
const people = require('./people/routes');

app.use('/api/movies', movies);
app.use('/api/people', people);

app.use(serveStatic(config.get('static.dirName')));

app.listen(config.get('express.port'), () => {
  console.log(`Listening to port ${config.get('express.port')}`)
});
