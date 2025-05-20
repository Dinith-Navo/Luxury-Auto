import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, CircularProgress, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/sales";

function UpdateSales() {
    const { saleId } = useParams();
    const [formData, setFormData] = useState({ paymentStatus: 'Pending' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSale = async () => {
            try {
                const response = await axios.get(`${URL}/${saleId}`);
                setFormData({ paymentStatus: response.data.paymentStatus });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching sale details:', err);
                setError('Failed to load sale details');
                setLoading(false);
            }
        };

        fetchSale();
    }, [saleId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${URL}/${saleId}`, formData);
            alert('Sale updated successfully');
            navigate('/sales-list');
        } catch (err) {
            console.error('Error updating sale:', err);
            setError('Failed to update sale');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ padding: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
            <Typography variant="h4" gutterBottom>
                Update Sale
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Payment Status</InputLabel>
                    <Select
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onChange={handleChange}
                        label="Payment Status"
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Refunded">Refunded</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                >
                    Update Sale
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ marginTop: 2, marginLeft: 2 }}
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
            </form>
        </Box>
    );
}

export default UpdateSales;