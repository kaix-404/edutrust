const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');

const {
  createUser,
  addSkillToUser,
  getUserSkills
} = require('../controllers/usersController');

router.post('/', verifyToken, createUser);
router.post('/:name/skills', verifyToken, addSkillToUser);

router.get('/:name/skills', getUserSkills);

module.exports = router;