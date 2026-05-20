const express = require('express');
const router = express.Router();

const {
  getSkills,
  connectSkills
} = require('../controllers/skillsController');

router.get('/', getSkills);
router.post('/connect', connectSkills);

module.exports = router;