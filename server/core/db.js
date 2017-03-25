const mongodb = require('./mongodb');
const config = require('config');

const db = mongodb.connect(config.get('mongodb.url'));

module.exports = db;
