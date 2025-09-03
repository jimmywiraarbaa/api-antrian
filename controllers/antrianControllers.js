const db = require('../config/db');

exports.createAntrian = async (req, res) => {
    try {
        const { id_loket } = req.body;
        if (!id_loket) {
            return res.status(400).json({ message: 'id_loket wajib diisi' });
        }

        // ambil nomor antrian terakhir untuk hari ini
        const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
        const [rows] = await db.query(
            "SELECT nomor_antrian FROM antrian WHERE DATE(created_at) = ? ORDER BY id DESC LIMIT 1",
            [today]
        );

        let nextNumber = 1;
        if (rows.length) {
            const lastNomor = parseInt(rows[0].nomor_antrian.substring(1)); // ambil angka dari format A001
            nextNumber = lastNomor + 1;
        }

        // format nomor antrian: A001, A002, dst
        const nomor_antrian = `A${String(nextNumber).padStart(3, '0')}`;

        // simpan ke database
        const [result] = await db.query(
            "INSERT INTO antrian (nomor_antrian, id_loket) VALUES (?, ?)",
            [nomor_antrian, id_loket]
        );

        return res.status(201).json({
            message: 'Antrian berhasil ditambahkan',
            id: result.insertId,
            nomor_antrian,
            id_loket
        });

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
