const express = require('express');
const router = express.Router();

const {
  getRecommendations
} = require('../controllers/recommendationControllers');

router.get('/:skill', getRecommendations);

module.exports = router;