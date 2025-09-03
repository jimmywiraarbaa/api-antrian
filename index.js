// app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth/authRoutes');
const antrianRoutes = require('./routes/antrianRoutes');


const authMiddleware = require('./middleware/authMiddleware');

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/antrian', antrianRoutes);

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '172.23.14.102', () => console.log(`Server running on port ${PORT}`));
