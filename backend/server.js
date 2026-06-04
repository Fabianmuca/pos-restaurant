const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/menu',     require('./routes/menuRoutes'));
app.use('/api/tables',   require('./routes/tableRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Global error handler
app.get('/', (req, res) => res.json({ message: 'BarPOS API po ecën ✅' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
