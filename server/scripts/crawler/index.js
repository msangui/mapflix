const movieCrawler = require('./movie');
const awardsCrawler = require('./awards');
const config = require('config');
const mongodb = require('../../core/mongodb');
const Promise = require('promise');
const _ = require('lodash');
const mode = process.argv[2];
const IMDB = require('../../constants').IMDB;

let page = _.toNumber(process.argv[3] || 1);
if (!mode) {
  console.error('Missing mode');
  return;
}

const checkMovie = (db, movieId, check) => {
  if (!check) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    mongodb.findDocument(db, config.get('mongodb.movieCollection'), {_id: movieId}).count((err, count) => {
      if (err) {
        reject(err);
      }
      if (count > 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

const saveMovie = (db, movieId, check = false) => {
  return new Promise((resolve, reject) => {
    checkMovie(db, movieId, check).then(() => {
      movieCrawler.crawl(movieId).then(movie => {
        console.log('saved movie ', movieId);
        resolve(mongodb.saveDocument(db, config.get('mongodb.movieCollection'), movie));
      }, (err) => reject(err));
    }, () => {
      console.log('skipped movie', movieId);
      resolve();
    });

  });
};

const bulk = (db, page, check) => {
  return new Promise((resolve, reject) => {
    movieCrawler.bulk(page).then(movieIds => {
      const promises = movieIds.map(movieId => saveMovie(db, movieId, check));
      Promise.all(promises).then(() => {
        console.log('******************* - done page ', page);
        bulk(db, page + 1, check);
      }, (err) => console.log(err));
    }, (err) => {
      console.log(err);
      reject(err);
    });
  });
};

const saveAwards = (db, year) => {
  return new Promise((resolve, reject) => {
    awardsCrawler.crawl(year, type).then(movies => {
      console.log('crawled award', year);
      Object.keys(movies).forEach(movieId => {
        mongodb.findDocument(db, config.get('mongodb.movieCollection'), {_id: movieId}).then((movie) => {
          if (!movie) {
            resolve();
          }
          resolve(mongodb.updateDocument(db, config.get('mongodb.movieCollection'), {_id: movieId}, {
            awards: (movie.awards || []).filter(award => award.eventType !== type).concat(movies[movieId])
          }));
        }, (err) => console.log(err));
      })
    }, (err) => reject(err));
  });
};

mongodb.connect(config.get('mongodb.url'), {poolSize: 50}).then(db => {
  switch (mode) {
    case 'movie':
      let movieId = process.argv[3];
      saveMovie(db, movieId).then(() => db.close());
      return;
    case 'bulk':
      bulk(db, page, process.argv[4]).then(() => db.close(), (err) => console.log(err));
      return;
    case 'award':
      saveAwards(db, process.argv[4], process.argv[3]).then(() => db.close(), (err) => console.log(err));
      return;
    case 'awardsBulk':
      let awards = [];
      let from = _.toNumber(process.argv[4]);
      let to = _.toNumber(process.argv[5]);
      for (let year=from; year<to; year++) {
        awards.push(saveAwards(db, year, process.argv[3]));
      }
      Promise.all(awards).then(() => db.close());
      return;
    default:
      mongodb.findDocument(db, config.get('mongodb.movieCollection'), {_id: process.argv[2]}).then((movie) => {
        console.log(movie)
      }, (err) => console.log(err));
      return;
  }

});

