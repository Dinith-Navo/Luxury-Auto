app.use('/users', userRoutes);
app.use('/Vehicles', VehiclesRoutes);
app.use('/customers', customerRoutes);
app.use('/payment', paymentRoutes);
app.use('/promotions', promotionRoutes);  // Prefix for promotion routes
app.use('/vehiclebookings', bookingRoutes);
app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes); // Prefixing all payment routes with `/payments`
