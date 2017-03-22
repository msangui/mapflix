const db = require('../core/db');
const mongodb = require('../core/mongodb');
const config = require('../config');
const _ = require('lodash');

const queryPeople = (partial, options = {}) => {
  return db.then(db => {

    const limit = _.toNumber(options.limit) || 50;
    const skip = (options.page && _.toNumber(options.page) > 0 ) ? limit * (_.toNumber(options.page) - 1) : 0;

    return mongodb.findDocuments(db, config.mongodb.peopleCollection, {name: {$regex: `.*${partial}.*`, $options: 'i'}}, limit, skip , {'_id': 1});
  })
};

const getNames = (ids) => {
  return db.then(db => {
    return mongodb.findDocuments(db, config.mongodb.peopleCollection, {_id: {$in: _.isArray(ids) ? ids : [ids]}});
  })
};

module.exports = {
  query(partial) {
    return queryPeople(partial);
  },
  getNames(ids) {
    return getNames(ids);
  }
};
