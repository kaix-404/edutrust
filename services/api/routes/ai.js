const express = require('express');
const router = express.Router();

const {
  verifySkill,
} = require('../controllers/aiController');


router.post('/verify-skill', verifySkill);

module.exports = router;