const express = require('express');
const router = express.Router();

const {
  getCareerPath
} = require('../controllers/careersController');

router.get('/:skill1/:skill2', getCareerPath);

module.exports = router;