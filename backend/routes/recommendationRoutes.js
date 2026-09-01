const express = require('express');
const router = express.Router();
const { getCropRecommendation, getAIAdvisory } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/crop', protect, getCropRecommendation);
router.get('/advisory', protect, getAIAdvisory);

module.exports = router;