import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit, Delete, Print } from '@mui/icons-material';
import { BarChartOutlined } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehiclebookings";

const fetchBookings = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('bookings');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings().then(setBookings).catch(setError);
  }, []);

  const handleEdit = (id) => {
    navigate(`/update-booking/${id}`);
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${URL}/${id}`);
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      setSuccess(true);
      setOpenSnackbar(true);
    } catch (error) {
      setError("Error deleting booking");
    }
  };

  const handlePDF = () => {
    if (bookings.length === 0) {
      alert("No bookings available for download.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Vehicle Booking Report", 10, 10);
    doc.autoTable({
      head: [['Booking ID', 'Customer ID', 'Vehicle ID', 'Pick-up Location', 'Status', 'Date From', 'Date To']],
      body: bookings.map(item => [
        item.bookingId,
        item.customerId,
        item.vehicleId,
        item.pickUpLocation,
        item.status,
        new Date(item.dateFrom).toLocaleDateString(),
        new Date(item.dateTo).toLocaleDateString(),
      ]),
    });
    doc.save('booking-details.pdf');
  };

  return (
    <Box>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(e, newView) => newView && setViewMode(newView)}
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="bookings"><Typography>Bookings</Typography></ToggleButton>
        <ToggleButton value="analysis"><BarChartOutlined /> Analysis</ToggleButton>
      </ToggleButtonGroup>

      {viewMode === 'bookings' ? (
        <>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Vehicle ID</TableCell>
                  <TableCell>Pick-up Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date From</TableCell>
                  <TableCell>Date To</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.bookingId}</TableCell>
                    <TableCell>{booking.customerId}</TableCell>
                    <TableCell>{booking.vehicleId}</TableCell>
                    <TableCell>{booking.pickUpLocation}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>{new Date(booking.dateFrom).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.dateTo).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(booking._id)}><Edit /></IconButton>
                      <IconButton onClick={() => deleteBooking(booking._id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" onClick={handlePDF} sx={{ marginTop: 2 }}>
            <Print /> Download Report
          </Button>
        </>
      ) : (
        <Typography variant="h6">Analysis View Coming Soon...</Typography>
      )}
      {error && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity="success">Booking deleted successfully!</Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default BookingDetails;
