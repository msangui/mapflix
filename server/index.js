const express = require('express');
const compression = require('compression');
const app = express();
const config = require('config');
const serveStatic = require('serve-static');
const movies = require('./movies/routes');
const people = require('./people/routes');

app.use(compression());

app.use('/api/movies', movies);
app.use('/api/people', people);

app.use(serveStatic(config.get('static.dirName')));

app.listen(process.env.PORT || config.get('express.port'), () => {
  console.log(`Listening to port ${process.env.PORT || config.get('express.port')}`)
});

