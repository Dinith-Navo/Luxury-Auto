import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const URL = "http://localhost:4000/sales";

function Sale() {
    const { saleId } = useParams();
    const [sale, setSale] = useState(null);

    useEffect(() => {
        const fetchSale = async () => {
            try {
                const response = await axios.get(`${URL}/${saleId}`);
                setSale(response.data);
            } catch (error) {
                console.error('Error fetching sale details:', error);
            }
        };

        fetchSale();
    }, [saleId]);

    if (!sale) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Sale Details
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Paper sx={{ padding: 3 }}>
                <Typography variant="h6">ID: {sale._id}</Typography>
                <Typography variant="h6">Vehicle ID: {sale.vehicleId}</Typography>
                <Typography variant="h6">Customer ID: {sale.customerId}</Typography>
                <Typography variant="h6">Rental Period: {sale.rentalPeriod} days</Typography>
                <Typography variant="h6">Total Amount: ${sale.totalAmount}</Typography>
                <Typography variant="h6">Payment Status: {sale.paymentStatus}</Typography>
            </Paper>
        </Box>
    );
}

export default Sale;