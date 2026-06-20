const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');

const {
  createRole,
  connectRoleSkill,
  getSkillGap,
  getRecommendations,
  getRoadmapForRole,
  getRoleRanking,
  recommendRoles
} = require('../controllers/roleController');

router.post('/', verifyToken, createRole);
router.post('/connect', verifyToken, connectRoleSkill);

router.get('/gap/:role/:user', getSkillGap);
router.get('/recommendations/:role/:user', getRecommendations);
router.get('/roadmap/:role/:user', getRoadmapForRole);
router.get('/rank/:role', getRoleRanking);
router.get('/recommend/:user', recommendRoles);

module.exports = router;