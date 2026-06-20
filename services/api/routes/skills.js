const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');

const {
  getSkills,
  connectSkills
} = require('../controllers/skillsController');

router.post('/connect', verifyToken, connectSkills);

router.get('/', getSkills);

module.exports = router;