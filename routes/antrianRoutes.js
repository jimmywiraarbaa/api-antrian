const express = require('express');
const router = express.Router();
const {
  createAntrian,
  getAllAntrian,
  getAntrianById,
  updateAntrian,
  deleteAntrian
} = require('../controllers/antrianControlles');

// endpoint
router.post('/', createAntrian);        // POST /api/antrian
router.get('/', getAllAntrian);        // GET /api/antrian
router.get('/:id', getAntrianById);    // GET /api/antrian/:id
router.put('/:id', updateAntrian);     // PUT /api/antrian/:id
router.delete('/:id', deleteAntrian);  // DELETE /api/antrian/:id

module.exports = router;
