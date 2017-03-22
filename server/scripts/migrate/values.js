const mongodb = require('../../core/mongodb');
const config = require('../../config');
const Promise = require('promise');
const _ = require('lodash');

mongodb.connect(config.mongodb.url).then(db => {
  mongodb.findDocuments(db, config.mongodb.movieCollection, {}).then(movies => {
    movies.forEach(movie => {
      (movie[process.argv[2]] || []).forEach(value => {
        mongodb.saveDocument(db, config.mongodb[`${process.argv[2]}Collection`], {
          _id: value
        })
      })
    })
  }, err=>console.log(err));
});
