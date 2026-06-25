const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');

const {
  createBadge,
  getUserBadges,
} = require('../controllers/badgeController');

router.post('/', verifyToken, createBadge);
router.get('/:user', verifyToken, getUserBadges);

module.exports = router;