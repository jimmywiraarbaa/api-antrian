const db = require('../../config/db');

// CREATE antrian
exports.createAntrian = async (req, res) => {
  try {
    const { nomorAntrian, layanan } = req.body;
    if ( !layanan) {
      return res.status(400).json({ message: 'nomor antrian dan layanan wajib diisi' });
    }

    const [result] = await db.query(
      'INSERT INTO antrian (nomor_antrian, layanan, status) VALUES (?, ?, ?)',
      [nama, layanan, 'MENUNGGU']
    );

    return res.status(201).json({ message: 'Antrian berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// READ semua antrian
exports.getAllAntrian = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM antrian ORDER BY id DESC');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// READ antrian by id
exports.getAntrianById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM antrian WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Data antrian tidak ditemukan' });

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE antrian
exports.updateAntrian = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, layanan, status } = req.body;

    const [result] = await db.query(
      'UPDATE antrian SET nama = ?, layanan = ?, status = ? WHERE id = ?',
      [nama, layanan, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data antrian tidak ditemukan' });
    }

    return res.json({ message: 'Antrian berhasil diupdate' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE antrian
exports.deleteAntrian = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM antrian WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data antrian tidak ditemukan' });
    }

    return res.json({ message: 'Antrian berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
