// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth/authRoutes');
const antrianRoutes = require('./routes/antrianRoutes');

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/antrian', antrianRoutes);

// const authMiddleware = require('./middleware/authMiddleware');
// app.get('/api/me', authMiddleware, (req, res) => {
//   res.json({ user: req.user });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
