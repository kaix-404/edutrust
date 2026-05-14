const express = require('express');
const router = express.Router();

const {
  getUserGraph
} = require('../controllers/graphController');

router.get('/:name', getUserGraph);

module.exports = router;