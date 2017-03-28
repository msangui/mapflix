const mongodb = require('../../core/mongodb');
const config = require('config');
const Promise = require('promise');

function migrate(db, page = 1) {
  mongodb.findDocuments(db, config.get('mongodb.movieCollection'), {}, 1, page).then(movies => {
    const promises = [];
    movies.forEach(movie => {
      movie.cast.forEach(person => {
        promises.push(mongodb.saveDocument(db, config.get('mongodb.peopleCollection'), {
          _id: person.id,
          name: person.name
        }, true));
      });
    });
    Promise.all(promises).then(() => {
      console.log('done page ', page);
      migrate(db, page + 1);
    }, err => console.log('err' ,err));
  });

}
mongodb.connect(config.get('mongodb.url')).then(db => {
  migrate(db, 0);
});
