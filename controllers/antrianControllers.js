const db = require('../config/db'); // koneksi db mysql

exports.getAntrian = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, nomor_antrian, status, created_at FROM antrian ORDER BY id ASC"
        );

        res.status(200).json({
            message: "Daftar antrian berhasil diambil",
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

exports.createAntrian = async (req, res) => {
    try {
        // Ambil nomor antrian terakhir hari ini
        const today = new Date().toISOString().slice(0, 10); // format YYYY-MM-DD
        const [lastAntrian] = await db.query(
            "SELECT nomor_antrian FROM antrian WHERE DATE(created_at) = ? ORDER BY id DESC LIMIT 1",
            [today]
        );

        // Tentukan nomor antrian baru
        let newNomor;
        if (lastAntrian.length === 0) {
            newNomor = "A-01"; // jika belum ada antrian hari ini
        } else {
            const lastNumber = parseInt(lastAntrian[0].nomor_antrian.split('-')[1]);
            const nextNumber = lastNumber + 1;
            newNomor = `A-${nextNumber.toString().padStart(2, '0')}`;
        }

        const statusAntrian = 'waiting'; // status default

        // Insert langsung ke database
        const [result] = await db.query(
            "INSERT INTO antrian (nomor_antrian, status, created_at) VALUES (?, ?, NOW())",
            [newNomor, statusAntrian]
        );

        // Kirim response dengan data antrian yang baru dibuat
        res.status(201).json({
            message: "Antrian berhasil dibuat",
            id: result.insertId,
            nomor_antrian: newNomor,
            status: statusAntrian
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

exports.updateAntrian = async (req, res) => {
    try {
        const { id } = req.params;       // ambil id antrian dari URL
        const { status } = req.body;     // ambil status baru dari body request

        // Validasi status baru
        const allowedStatus = ['waiting', 'serving', 'done', 'skipped'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status tidak valid" });
        }

        // Update status di database
        const [result] = await db.query(
            "UPDATE antrian SET status = ? WHERE id = ?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Antrian tidak ditemukan" });
        }

        res.status(200).json({
            message: "Status antrian berhasil diupdate",
            id: id,
            status: status
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
