/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddBooking from './AddBooking';

const URL = "http://localhost:4000/vehicle-booking";

function Booking() {
    const [bookings, setBookings] = useState([]);
    const [showAddBookingForm, setShowAddBookingForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(URL);
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching bookings.');
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleEdit = (id) => {
        navigate(`/update-vehicle-booking/${id}`);
    };

    const deleteBooking = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this booking?');
        if (confirmed) {
            try {
                await axios.delete(`${URL}/${id}`);
                setBookings(prev => prev.filter(booking => booking._id !== id));
            } catch (error) {
                setError('Error deleting booking.');
            }
        }
    };

    const handleAddBooking = () => {
        setShowAddBookingForm(true);
    };

    const handleBack = () => {
        setShowAddBookingForm(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            {showAddBookingForm ? (
                <AddBooking onBack={handleBack} />
            ) : (
                <>
                    <Box sx={{ marginBottom: 2 }}>
                        <Button variant="contained" color="secondary" onClick={handleAddBooking}>
                            Add Vehicle Booking
                        </Button>
                    </Box>

                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Booking ID</TableCell>
                                        <TableCell>Pickup Location</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date From</TableCell>
                                        <TableCell>Date To</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookings.map(booking => (
                                        <TableRow key={booking._id}>
                                            <TableCell>{booking.BookingId}</TableCell>
                                            <TableCell>{booking.pickUpLocation}</TableCell>
                                            <TableCell>{booking.status}</TableCell>
                                            <TableCell>{new Date(booking.dateFrom).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(booking.dateTo).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button variant="outlined" color="primary" onClick={() => handleEdit(booking._id)} sx={{ marginRight: 1 }}>
                                                    Edit
                                                </Button>
                                                <Button variant="outlined" color="error" onClick={() => deleteBooking(booking._id)}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}
        </Box>
    );
}

export default Booking;