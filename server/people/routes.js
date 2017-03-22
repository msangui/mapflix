const express = require('express');
const router = express.Router();
const model = require('./model');

router.get('/', (req, res) => {
  const queryParams = req.query;
  model.query(queryParams.partial).then(people => res.status(200).send(people), err => res.state(500).send(err));
});

router.get('/names', (req, res) => {
  const queryParams = req.query;
  model.getNames(queryParams.ids).then(people => res.status(200).send(people), err => res.state(500).send(err));
});

module.exports = router;
