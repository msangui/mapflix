const mongodb = require('../../core/mongodb');
const config = require('../../config');
const Promise = require('promise');
const _ = require('lodash');

// mongodb.connect(config.mongodb.url).then(db => {
//   mongodb.findDocuments(db, config.mongodb.movieCollection, {}).then(movies => {
//     movies.forEach((movie, index) => {
//       movie.cast.forEach(pp => {
//         pp.role = 'actor';
//       });
//       (movie.directors || []).forEach(director => {
//         movie.cast.unshift(Object.assign({role: 'director'}, director));
//       });
//       (movie.writers || []).forEach(director => {
//         movie.cast.unshift(Object.assign({role: 'writer'}, director));
//       });
//       (movie.producers || []).forEach(director => {
//         movie.cast.unshift(Object.assign({role: 'producer'}, director));
//       });
//       (movie.music || []).forEach(director => {
//         movie.cast.unshift(Object.assign({role: 'music'}, director));
//       });
//
//       console.log(movie._id, 'for the save');
//
//       mongodb.updateDocument(db,
//         config.mongodb.movieCollection,
//         {_id: movie._id},
//         {cast: movie.cast},
//         {directors: "", writers: "", music: "", producers: ""}).then(() => console.log(movie._id, index));
//     });
//   });
// });


mongodb.connect(config.mongodb.url).then(db => {
  mongodb.findDocuments(db, config.mongodb.movieCollection, {}).then(movies => {
    movies.forEach((movie, index) => {

      movie.stars.forEach(star => {
        star.name = star.name.replace(/,$/, '');
      });

      mongodb.updateDocument(db,
        config.mongodb.movieCollection,
        {_id: movie._id},
        {stars: movie.stars}).then(() => console.log(movie._id, index));
    }, (err) => console.log(err));
  });
});

