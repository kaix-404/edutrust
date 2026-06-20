const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');

const {
  endorseUser,
  getEndorsements,
  getEndorsementNetwork,
  getInfluenceRanking
} = require('../controllers/endorsementsController');

router.post('/', verifyToken, endorseUser);

router.get('/network', getEndorsementNetwork);
router.get('/influence', getInfluenceRanking);
router.get('/:user', getEndorsements);

module.exports = router;