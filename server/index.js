const express = require('express');
const app = express();
const config = require('../conf/server.conf');
const serveStatic = require('serve-static');
const movies = require('./movies/routes');
const people = require('./people/routes');

app.use('/api/movies', movies);
app.use('/api/people', people);

app.use(serveStatic('./client'));

app.listen(config.port, () => console.log(`Listening to port ${config.port}`));
