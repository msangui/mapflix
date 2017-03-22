const mongodb = require('../../core/mongodb');
const config = require('../../config');
const Promise = require('promise');
const _ = require('lodash');

mongodb.connect(config.mongodb.url).then(db => {
  mongodb.findDocuments(db, config.mongodb.movieCollection, {}).then(movies => {
    movies.forEach(movie => {
      movie.cast.forEach(person => {
        mongodb.saveDocument(db, config.mongodb.peopleCollection, {
          _id: person.id,
          name: person.name
        })
      })
    })
  });
});
