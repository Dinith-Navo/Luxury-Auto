import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Select, MenuItem, InputAdornment, IconButton, Typography
} from "@mui/material";
import { Add, Edit, Delete, Download, Search } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:4000/vehiclebookings");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleOpenAddDialog = (booking = null) => {
    setCurrentBooking(
      booking || {
        bookingId: `B00${bookings.length + 1}`,
        customerId: "",
        vehicleId: "",
        pickUpLocation: "",
        status: "",
        dateFrom: "",
        dateTo: "",
      }
    );
    setOpenAddDialog(true);
  };

  const handleOpenDialog = (booking = null) => {
    setCurrentBooking(
      booking || {
        bookingId: `B00${bookings.length + 1}`,
        customerId: "",
        vehicleId: "",
        pickUpLocation: "",
        status: "",
        dateFrom: "",
        dateTo: "",
      }
    );
    setOpenDialog(true);
  };

  const handleSaveBooking = async () => {
    try {
      // Update existing booking
      const response = await fetch(
        `http://localhost:4000/vehiclebookings/${currentBooking._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentBooking),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      fetchBookings();
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleAddBooking = async () => {
    try {
      if (currentBooking.bookingId.startsWith("B00")) {
        // Create new booking
        alert("Booking added successfully!");
        const response = await fetch("http://localhost:4000/vehiclebookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentBooking),
        });
        if (!response.ok) {
          throw new Error("Failed to create booking");
        }
      }
      fetchBookings();
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleDeleteBooking = async (_id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/vehiclebookings/${_id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (booking.customerId.toLowerCase().includes(searchLower) ||
        booking.vehicleId.toLowerCase().includes(searchLower) ||
        booking.pickUpLocation.toLowerCase().includes(searchLower)) &&
      (filterStatus === "" || booking.status === filterStatus)
    );
  });

  const handlePrintPDF = (booking) => {
    const doc = new jsPDF();

    // Add bold title with styling
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Details", 14, 20);

    // Add a colored rectangle as a header background
    doc.setFillColor(230, 230, 250); // Light lavender color
    doc.rect(10, 25, 190, 10, "F");

    // Add table with custom styles
    doc.autoTable({
      startY: 40,
      headStyles: {
        fillColor: [63, 81, 181], // Indigo color
        textColor: [255, 255, 255], // White text
        fontSize: 12,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 10,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternate rows
      },
      head: [
        [
          "Booking ID",
          "Customer ID",
          "Vehicle ID",
          "Pick-up Location",
          "Status",
          "Date From",
          "Date To",
        ],
      ],
      body: [
        [
          booking.bookingId,
          booking.customerId,
          booking.vehicleId,
          booking.pickUpLocation,
          booking.status,
          new Date(booking.dateFrom).toLocaleString(),
          new Date(booking.dateTo).toLocaleString(),
        ],
      ],
    });

    // Save the PDF with a descriptive filename
    doc.save(`Booking_${booking.bookingId}.pdf`);
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🚗 Booking Management
      </Typography>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <TextField
          label="Search Customer/Vehicle"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
          style={{ flex: "1" }}
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          displayEmpty
          variant="outlined"
          style={{ minWidth: "150px" }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Confirmed">✅ Confirmed</MenuItem>
          <MenuItem value="Pending">⏳ Pending</MenuItem>
          <MenuItem value="Cancelled">❌ Cancelled</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenAddDialog()}
        >
          Add Booking
        </Button>
      </div>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#eeeeee" }}>
              <TableCell><b>Booking ID</b></TableCell>
              <TableCell><b>Customer ID</b></TableCell>
              <TableCell><b>Vehicle ID</b></TableCell>
              <TableCell><b>Pick-up Location</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Date From</b></TableCell>
              <TableCell><b>Date To</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.bookingId} hover>
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell>{booking.customerId}</TableCell>
                <TableCell>{booking.vehicleId}</TableCell>
                <TableCell>{booking.pickUpLocation}</TableCell>
                <TableCell>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor:
                        booking.status === "Confirmed"
                          ? "#4caf50"
                          : booking.status === "Pending"
                            ? "#ff9800"
                            : "#f44336",
                      color: "white",
                    }}
                  >
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(booking.dateFrom).toLocaleDateString()} <br />
                  <small>{new Date(booking.dateFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </TableCell>
                <TableCell>
                  {new Date(booking.dateTo).toLocaleDateString()} <br />
                  <small>{new Date(booking.dateTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(booking)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete booking ${booking.bookingId}?`
                        )
                      ) {
                        handleDeleteBooking(booking._id);
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handlePrintPDF(booking)}>
                    <Download />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentBooking?.bookingId ? "✏️ Edit Booking" : "➕ Add Booking"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Customer ID"
            value={currentBooking?.customerId || ""}
            onChange={(e) =>
              setCurrentBooking({ ...currentBooking, customerId: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Vehicle ID"
            value={currentBooking?.vehicleId || ""}
            onChange={(e) =>
              setCurrentBooking({ ...currentBooking, vehicleId: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Pick-up Location"
            value={currentBooking?.pickUpLocation || ""}
            onChange={(e) =>
              setCurrentBooking({ ...currentBooking, pickUpLocation: e.target.value })
            }
          />
          <Select
            fullWidth
            value={currentBooking?.status || ""}
            onChange={(e) =>
              setCurrentBooking({ ...currentBooking, status: e.target.value })
            }
          >
            <MenuItem value="Confirmed">✅ Confirmed</MenuItem>
            <MenuItem value="Pending">⏳ Pending</MenuItem>
            <MenuItem value="Cancelled">❌ Cancelled</MenuItem>
          </Select>
          <TextField
            fullWidth
            margin="dense"
            label="Date From"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentBooking?.dateFrom || ""}
            onChange={(e) => {
              const selectedDate = e.target.value;
              const today = new Date().toISOString().split("T")[0];
              if (selectedDate < today) {
                alert("Date From cannot be in the past.");
              } else {
                setCurrentBooking({ ...currentBooking, dateFrom: selectedDate });
              }
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Date To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentBooking?.dateTo || ""}
            onChange={(e) => {
              const selectedDate = e.target.value;
              if (currentBooking?.dateFrom && selectedDate < currentBooking.dateFrom) {
                alert("Date To cannot be before Date From.");
              } else {
                setCurrentBooking({ ...currentBooking, dateTo: selectedDate });
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (
                currentBooking?.dateFrom &&
                currentBooking?.dateTo &&
                currentBooking.dateTo < currentBooking.dateFrom
              ) {
                alert("Date To cannot be before Date From.");
              } else {
                handleSaveBooking();
                setOpenDialog(false)
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>
          {currentBooking?.bookingId ? "➕ Add Booking" : "➕ Add Booking"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Customer ID"
            value={currentBooking?.customerId || ""}
            onChange={(e) =>
              setCurrentBooking({ ...currentBooking, customerId: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Vehicle ID"
            value={currentBooking?.vehicleId || ""}
            onChange={(e) =>
              setCurrentBooking({ ...currentBooking, vehicleId: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Pick-up Location"
            value={currentBooking?.pickUpLocation || ""}
            onChange={(e) =>
              setCurrentBooking({ ...currentBooking, pickUpLocation: e.target.value })
            }
          />
          <Select
            fullWidth
            value={currentBooking?.status || ""}
            onChange={(e) =>
              setCurrentBooking({ ...currentBooking, status: e.target.value })
            }
          >
            <MenuItem value="Confirmed">✅ Confirmed</MenuItem>
            <MenuItem value="Pending">⏳ Pending</MenuItem>
            <MenuItem value="Cancelled">❌ Cancelled</MenuItem>
          </Select>
          <TextField
            fullWidth
            margin="dense"
            label="Date From"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={currentBooking?.dateFrom || ""}
            onChange={(e) => {
              const selectedDateTime = e.target.value;
              const now = new Date().toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'

              if (selectedDateTime < now) {
                alert("Date From cannot be in the past.");
              } else {
                setCurrentBooking({ ...currentBooking, dateFrom: selectedDateTime });
              }
            }}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Date To"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={currentBooking?.dateTo || ""}
            onChange={(e) => {
              const selectedDateTime = e.target.value;
              const now = new Date().toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'

              if (selectedDateTime < now) {
                alert("Date From cannot be in the past.");
              } else {
                setCurrentBooking({ ...currentBooking, dateTo: selectedDateTime });
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (
                currentBooking?.dateFrom &&
                currentBooking?.dateTo &&
                currentBooking.dateTo < currentBooking.dateFrom
              ) {
                alert("Date To cannot be before Date From.");
              } else {
                handleAddBooking();
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingDetails;
