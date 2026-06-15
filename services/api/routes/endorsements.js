const express = require('express');
const router = express.Router();

const {
  endorseUser,
  getEndorsements,
  getEndorsementNetwork,
  getInfluenceRanking
} = require('../controllers/endorsementsController');

router.post('/', endorseUser);
router.get('/network', getEndorsementNetwork);
router.get('/influence', getInfluenceRanking);
router.get('/:user', getEndorsements);

module.exports = router;