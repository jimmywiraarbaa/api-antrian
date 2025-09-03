const express = require('express');
const router = express.Router();
const {
  createAntrian,
  getAntrian,
  // updateAntrian,
} = require('../controllers/antrianControllers');

const authMiddleware = require('../middleware/authMiddleware');

// endpoint
router.post('/', createAntrian);        // POST /api/antrian
router.get('/', authMiddleware, getAntrian);        // GET /api/antrian
// router.put('/:id', updateAntrian);     // PUT /api/antrian/:id

module.exports = router;
