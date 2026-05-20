const express = require('express');
const router = express.Router();

const {
  getCareerPath
} = require('../controllers/careersController');

router.get('/:startSkill/:goalSkill', getCareerPath);

module.exports = router;