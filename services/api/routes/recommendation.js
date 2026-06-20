const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');

const {
  getRecommendations,
  recommendSkills
} = require('../controllers/recommendationControllers');

router.get('/:skill', verifyToken, getRecommendations);

router.get('/skill/:user', recommendSkills);

module.exports = router;