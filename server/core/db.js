const mongodb = require('./mongodb');
const config = require('../config');

const db = mongodb.connect(config.mongodb.url);

module.exports = db;
