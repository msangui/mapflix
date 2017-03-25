const db = require('../core/db');
const mongodb = require('../core/mongodb');
const config = require('config');
const _ = require('lodash');
const Promise = require('promise');

const defaultProjection = {
  name: true,
  stars: true,
  rating: true,
  genres: true,
  countries: true,
  languages: true,
  runtime: true,
  color: true,
  image: true,
  description: true,
  releaseDate: true,
  cast: {
    $elemMatch: {
      role: 'director'
    }
  },
  awards: true
};

const queryMovies = (query = {}, options) => {
  return db.then(db => {

    const limit = _.toNumber(options.limit) || 50;
    const skip = (options.page && _.toNumber(options.page) > 0 ) ? limit * (_.toNumber(options.page) - 1) : 0;
    const sortBy = options.sortBy || 'releaseDate';
    const sortDirection = options.sortDirection === 'asc' ? 1 : -1;

    const projection = Object.assign({}, defaultProjection, options.projection || {});


    return mongodb.findDocuments(db, config.get('mongodb.movieCollection'), query, limit, skip, {[sortBy]: sortDirection}, projection);
  })
};

const buildQuery = (filters = {}) => {

  const mongoFilters = [];
  // check for rating
  if (filters.rating) {
    mongoFilters.push({'rating.value' : {$gt: _.toNumber(filters.rating)}});
  }

  // check for genres
  if (filters.genres) {
    mongoFilters.push({genres: {$in: _.isArray(filters.genres) ? filters.genres : [filters.genres]}});
  }

  // check for countries
  if (filters.countries) {
    mongoFilters.push({countries: {$in: _.isArray(filters.countries) ? filters.countries : [filters.countries]}});
  }

  // check for languages
  if (filters.languages) {
    mongoFilters.push({languages: {$in: _.isArray(filters.languages) ? filters.languages : [filters.languages]}});
  }

  // check releaseYear
  if (filters.releaseYear) {
    mongoFilters.push({releaseDate: {$gt: new Date(`${filters.releaseYear}-01-01`)}});
  }

  // check runtime
  if (filters.runtime) {
    mongoFilters.push({runtime: {$gt: _.toNumber(filters.runtime)}});
  }

  // cast {
  if (filters.cast) {
    (_.isArray(filters.cast) ? filters.cast : [filters.cast]).forEach(personId => {
      mongoFilters.push({
        cast: {
          $elemMatch: {
            id: personId
          }
        }
      });
    });
  }

  if (filters.awards) {
    (_.isArray(filters.awards) ? filters.awards : [filters.awards]).forEach(awardParam => {
      const [eventType, winner, awardName] = awardParam.split(',');
      const award = {
        eventType
      };

      if (winner === 'winner') {
        award.winner = true;
      }

      if (awardName) {
        award.name = {
          $regex: new RegExp(awardName.replace(/-/g,'(.{1,2})')),
          $options: 'i'
        }
      }

      mongoFilters.push({
        awards: {
          $elemMatch: award
        }
      });
    });
  }

  if (!mongoFilters.length) {
    return {};
  }

  return {$and: mongoFilters};
};

const movieOptions = () => {
  return db.then(db => {
    return Promise.all([
      mongodb.findDocuments(db, config.get('mongodb.genresCollection'), {}),
      mongodb.findDocuments(db, config.get('mongodb.languagesCollection'), {}),
      mongodb.findDocuments(db, config.get('mongodb.countriesCollection'), {})
    ]).then(([genres, languages, countries]) => {

      return {
        genres: genres.map(doc => doc._id),
        languages: languages.map(doc => doc._id),
        countries: countries.map(doc => doc._id)
      }
    });
  })
};


module.exports = {
  query(options) {
    return queryMovies(buildQuery(options), options);
  },
  options() {
    return movieOptions();
  }
};
