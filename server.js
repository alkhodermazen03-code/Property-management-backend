const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const pool = require('./src/config/db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
    }
});
app.use(cors({
 origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(cors());
app.use(express.json());

// نخلي io متاح لأي مكان بالتطبيق عن طريق app
app.set('io', io);

app.get('/', (req, res) => {
    res.json({ message: 'Server is running ' });
});

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ dbTime: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const buildingRoutes = require('./src/routes/buildingRoutes');
app.use('/api/buildings', buildingRoutes);

const unitRoutes = require('./src/routes/unitRoutes');
app.use('/api/units', unitRoutes);

const tenantRoutes = require('./src/routes/tenantRoutes');
app.use('/api/tenants', tenantRoutes);

const contractRoutes = require('./src/routes/contractRoutes');
app.use('/api/contracts', contractRoutes);

const paymentRoutes = require('./src/routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

const expenseRoutes = require('./src/routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

const incomeRoutes = require('./src/routes/incomeRoutes');
app.use('/api/income', incomeRoutes);

// إعداد الـ socket connections
require('./src/sockets/notifications')(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});