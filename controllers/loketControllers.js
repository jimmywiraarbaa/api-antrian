const db = require('../config/db');

// ✅ Ambil semua loket
exports.getAllLoket = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM loket');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Tambah loket baru
exports.createLoket = async (req, res) => {
  try {
    const { nama, status } = req.body;
    if (!nama) {
      return res.status(400).json({ message: 'Nama loket wajib diisi' });
    }

    const [result] = await db.query(
      'INSERT INTO loket (nama, status) VALUES (?, ?)',
      [nama, status || 'aktif']
    );

    return res.status(201).json({
      message: 'Loket berhasil ditambahkan',
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update loket
exports.updateLoket = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, status } = req.body;

    const [result] = await db.query(
      'UPDATE loket SET nama = ?, status = ? WHERE id = ?',
      [nama, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Loket tidak ditemukan' });
    }

    return res.json({ message: 'Loket berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Hapus loket
exports.deleteLoket = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM loket WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Loket tidak ditemukan' });
    }

    return res.json({ message: 'Loket berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
