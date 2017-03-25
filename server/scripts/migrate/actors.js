const mongodb = require('../../core/mongodb');
const config = require('config');
const _ = require('lodash');

mongodb.connect(config.get('mongodb.url')).then(db => {
  mongodb.findDocuments(db, config.get('mongodb.movieCollection'), {}).then(movies => {
    movies.forEach(movie => {
      movie.cast.forEach(person => {
        mongodb.saveDocument(db, config.get('mongodb.peopleCollection'), {
          _id: person.id,
          name: person.name
        })
      })
    })
  });
});
