const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');

const {
  awardBadge,
  getBadges,
} = require('../controllers/aiController');

router.post("/award/start", verifyToken, startSkillInterview);
router.post("/interview/evaluate", verifyToken, evaluateInterview);

module.exports = router;