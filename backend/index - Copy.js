import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import logoRoutes from './routes/logoRoutes.js';
import countryRoutes from './routes/countries.js';
import paymentTermRoutes from './routes/paymentTerms.js'; // ✅ NEW
import customerSectorsRoutes from './routes/customerSectors.js'; // ✅ NEW

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🧪 Connecting to:', process.env.DATABASE_URL);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logo', logoRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/payment-terms', paymentTermRoutes); // ✅ NEW
app.use('/api/customer-sectors', customerSectorsRoutes); // ✅ NEW

// Test route
app.get('/', (req, res) => {
  res.send('🚀 PPH Backend is running.');
});

// Start server
app.listen(PORT, async () => {
  try {
    await pool.connect();
    console.log(`✅ Server is running at http://localhost:${PORT}`);
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
});
