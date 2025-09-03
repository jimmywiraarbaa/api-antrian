const express = require('express');
const router = express.Router();
const {
  createAntrian,
  getAntrian,
  // updateAntrian,
} = require('../controllers/antrianControllers');

// endpoint
router.post('/', createAntrian);        // POST /api/antrian
router.get('/', getAntrian);        // GET /api/antrian
// router.put('/:id', updateAntrian);     // PUT /api/antrian/:id

module.exports = router;
