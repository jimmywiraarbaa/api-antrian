const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password required' });
    }

    // cek apakah email sudah ada
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(409).json({ message: 'Email telah digunakan' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // simpan ke db
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash]
    );

    return res.status(201).json({ message: 'User registered', userId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const [rows] = await db.query('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Email atau password salah' });

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email atau password salah' });

    const payload = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.json({ message: 'Logged in', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
