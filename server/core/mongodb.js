const MongoClient = require('mongodb').MongoClient;
const Promise = require('promise');
const _ = require('lodash');

module.exports = {
  connect(url) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, function(err, db) {
        if (err) {
          reject(err);
          return;
        }

        resolve(db);
      });
    });
  },
  findDocuments(db, collectionName, query = {}, limit = 10000, skip = 0, sort = {}, options = {}) {
    return new Promise((resolve, reject) => {
      const collection = db.collection(collectionName);
      collection.find(query, options).limit(limit).skip(skip).sort(sort).toArray((err, docs) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(docs);
      });
    });
  },
  insertDocument(db, collectionName, document) {
    return new Promise((resolve, reject) => {
      const collection = db.collection(collectionName);
      collection.insertOne(document, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(document);
      })
    });
  },
  saveDocument(db, collectionName, document, retry = false) {
    return new Promise((resolve, reject) => {
      const collection = db.collection(collectionName);
      collection.save(document, (err, res) => {
        if (err) {
          if (retry) {
            resolve(this.saveDocument(db, collectionName, document, false));
          } else {
            reject(err);
          }
          return;
        }
        resolve(res.result);
      })
    });
  },
  updateDocument(db, collectionName, query, newProps, removeProps) {
    return new Promise((resolve, reject) => {
      const collection = db.collection(collectionName);

      const updateOptions = {};

      if (newProps !== undefined && _.isObject(newProps)) {
        updateOptions.$set = newProps;
      }

      if (removeProps !== undefined && _.isObject(removeProps)) {
        updateOptions.$unset = removeProps;
      }

      collection.update(query, updateOptions, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response.result);
      })
    });
  },
  findDocument(db, collectionName, query = {}) {
    return new Promise((resolve, reject) => {
      const collection = db.collection(collectionName);
      collection.findOne(query, (err, doc) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(doc);
      });
    });
  },
  close(db) {
    db.close();
  }
};
