const express = require('express');
const router = express.Router();

const {
  endorseUser,
  getEndorsements
} = require('../controllers/endorsementsController');

router.post('/', endorseUser);
router.get('/:user', getEndorsements);

module.exports = router;