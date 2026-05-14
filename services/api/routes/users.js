const express = require('express');
const router = express.Router();

const {
  createUser,
  addSkillToUser,
  getUserSkills
} = require('../controllers/usersController');

router.post('/', createUser);

router.post('/:name/skills', addSkillToUser);

router.get('/:name/skills', getUserSkills);

module.exports = router;