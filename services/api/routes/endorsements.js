const express = require('express');
const router = express.Router();

const {
  endorseUser
} = require('../controllers/endorsementsController');

router.post('/', endorseUser);

module.exports = router;