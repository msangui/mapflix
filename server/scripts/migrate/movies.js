const mongodb = require('../../core/mongodb');
const config = require('config');
const Promise = require('promise');
const _ = require('lodash');


mongodb.connect(config.get('mongodb.url')).then(db => {
  mongodb.findDocuments(db, config.get('mongodb.movieCollection'), {}).then(movies => {
    movies.forEach((movie, index) => {

      movie.stars.forEach(star => {
        star.name = star.name.replace(/,$/, '');
      });

      mongodb.updateDocument(db,
        config.get('mongodb.movieCollection'),
        {_id: movie._id},
        {stars: movie.stars}).then(() => console.log(movie._id, index));
    }, (err) => console.log(err));
  });
});

