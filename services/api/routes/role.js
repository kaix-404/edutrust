const express = require('express');

const router = express.Router();

const {
  createRole,
  connectRoleSkill,
  getSkillGap,
  getRecommendations,
  getRoadmapForRole
} = require('../controllers/roleController');

router.post('/', createRole);
router.post('/connect', connectRoleSkill);
router.get('/gap/:role/:user', getSkillGap);
router.get('/recommendations/:role/:user', getRecommendations);
router.get('/roadmap/:role/:user', getRoadmapForRole);

module.exports = router;