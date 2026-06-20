const express = require('express');
const router = express.Router();

const {
  compareCandidates,
} = require('../controllers/comparisonController');

router.get('/:candidate1/:candidate2', compareCandidates);

module.exports = router;