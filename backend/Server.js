require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Import routes
const userRoutes = require('./Routes/UserRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const VehiclesRoutes = require('./Routes/VehiclesRoutes');
const customerRoutes = require('./Routes/CustomerRoutes');
const bookingRoutes = require('./Routes/BookingRoutes');
const promotionRoutes = require('./Routes/PromotionRoutes');
const authRoutes = require('./Routes/AuthRoutes');
const salesRoutes = require('./Routes/SalesRoutes'); 
const router = require('./router'); // Assuming this is the correct path to your router

// Middleware
app.use(express.json());
app.use(cors()); // Configurable if needed with CORS options

// Route middleware
app.use('/users', userRoutes);
app.use('/vehicles', VehiclesRoutes);
app.use('/customers', customerRoutes);
app.use('/payment', paymentRoutes);
app.use('/promotions', promotionRoutes);  // Prefix for promotion routes
app.use('/vehiclebookings', bookingRoutes);
app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes); // Prefixing all payment routes with `/payments`
app.use('/sales', salesRoutes); // Prefix for sales routes
app.use('/api', router);


// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Environment variables and database setup
const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL || 'mongodb+srv://asd:asd@itpm.cdjik.mongodb.net/';

// Connect to MongoDB
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`);
});
