const express = require('express');
const router = express.Router();
const model = require('./model');

router.get('/', (req, res) => {
  const queryParams = req.query;
  model.query(queryParams).then(movies => res.status(200).send(movies));
});

router.get('/options', (req, res) => {
  model.options().then(options => res.status(200).send(options));
});

module.exports = router;
