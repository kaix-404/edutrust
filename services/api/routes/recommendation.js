const express = require('express');
const router = express.Router();

const {
  getRecommendations,
  recommendSkills
} = require('../controllers/recommendationControllers');

router.get('/:skill', getRecommendations);
router.get('/skill/:user', recommendSkills);

module.exports = router;