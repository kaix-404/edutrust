const express = require('express');

const router = express.Router();

const {
  createRole,
  connectRoleSkill,
  getSkillGap,
  getRecommendations
} = require('../controllers/roleController');

router.post('/', createRole);
router.post('/connect', connectRoleSkill);
router.get('/gap/:role/:user', getSkillGap);
router.get('/recommendations/:role/:user', getRecommendations);

module.exports = router;