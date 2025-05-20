import React, { useState, useEffect } from "react";
import axios from "axios";

import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Box,
    TextField,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    CardMedia,
} from "@mui/material";

import Footer from "../Footer/Footer";
import Header from "../Navbar/Navbar";
// Removed unused Link import

const VehiclePage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ type: "", fuel: "", transmission: "" });
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [currentBooking, setCurrentBooking] = useState(null);


    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get("http://localhost:4000/vehicles");
                setVehicles(response.data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };
        fetchVehicles();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

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

    const handleAddBooking = async () => {
        try {
            const newBooking = {
                ...currentBooking,
                bookingId: `B00${Math.floor(Math.random() * 10000)}`,
            };

            const response = await fetch("http://localhost:4000/vehiclebookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBooking),
            });

            if (!response.ok) {
                throw new Error("Failed to create booking");
            }

            fetchBookings();
            setOpenViewDialog(false);
        } catch (error) {
            console.error("Error saving booking:", error);
        }
    };

    useEffect(() => {
        if (selectedVehicle && !currentBooking?.vehicleId) {
            setCurrentBooking((prev) => ({
                ...prev,
                vehicleId: selectedVehicle.vehicleId,
            }));
        }
    }, [selectedVehicle, currentBooking]);


    const filteredVehicles = vehicles.filter((vehicle) =>
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filters.type ? vehicle.type === filters.type : true) &&
        (filters.fuel ? vehicle.fuel === filters.fuel : true) &&
        (filters.transmission ? vehicle.transmission === filters.transmission : true)
    );

    return (
        <Box sx={{ padding: 3 }}>
            <Header />

            <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <TextField
                    fullWidth
                    label="Search Vehicles"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <Select
                    fullWidth
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    displayEmpty
                >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Sedan">Sedan</MenuItem>
                    <MenuItem value="SUV">SUV</MenuItem>
                    <MenuItem value="Truck">Truck</MenuItem>
                    <MenuItem value="Bus">Bus</MenuItem>
                    <MenuItem value="Bike">Bike</MenuItem>
                    <MenuItem value="Van">Van</MenuItem>
                </Select>
                <Select
                    fullWidth
                    name="fuel"
                    value={filters.fuel}
                    onChange={handleFilterChange}
                    displayEmpty
                >
                    <MenuItem value="">All Fuel Types</MenuItem>
                    <MenuItem value="Petrol">Petrol</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                    <MenuItem value="Electric">Electric</MenuItem>
                </Select>
                <Select
                    fullWidth
                    name="transmission"
                    value={filters.transmission}
                    onChange={handleFilterChange}
                    displayEmpty
                >
                    <MenuItem value="">All Transmissions</MenuItem>
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                </Select>
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {filteredVehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.vehicleId}>
                        <Card sx={{ cursor: "pointer", height: "100%" }} onClick={() => { setOpenViewDialog(true); setSelectedVehicle(vehicle); }}>
                            <img
                                src={vehicle.image}
                                alt={vehicle.name}
                                style={{ width: "100%", height: 200, objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6">{vehicle.name}</Typography>
                                <Typography color="textSecondary">{vehicle.type}</Typography>
                                <Typography variant="body2">Fuel: {vehicle.fuel}</Typography>
                                <Typography variant="body2">Seats: {vehicle.seats}</Typography>
                                <Typography variant="body2">Transmission: {vehicle.transmission}</Typography>
                                <Typography variant="body2">Price: ${vehicle.price}</Typography>
                                <Typography variant="body2">Status: {vehicle.status}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setOpenViewDialog(true); setSelectedVehicle(vehicle); }}
                                    sx={{ marginTop: 1 }}
                                >
                                    Book Now
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
                <DialogTitle>
                    {currentBooking?.bookingId ? "➕ Add Booking" : "➕ Add Booking"}
                </DialogTitle>
                <Typography variant="h6"> Vehicle : {selectedVehicle?.name}</Typography>

                <CardMedia
                    component="img"
                    style={{ width: '200px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                    image={selectedVehicle?.image || ""}
                    alt={selectedVehicle?.name || "Vehicle"}
                />
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Customer Name"
                        value={currentBooking?.customerId || ""}
                        onChange={(e) =>
                            setCurrentBooking({ ...currentBooking, customerId: e.target.value })
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Vehicle ID"
                        value={currentBooking?.vehicleId || ''}
                        onChange={(e) =>
                            setCurrentBooking({ ...currentBooking, vehicleId: e.target.value })
                        }
                    />
                    <div style={{ height: '300px', width: '100%' }}>
                        <iframe
                            title="Map"
                            src={`https://www.google.com/maps?q=${selectedVehicle?.location || "WX7F+V5+Malabe,+Sri+Lanka"}&output=embed`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const location = `${position.coords.latitude},${position.coords.longitude}`;
                                    setCurrentBooking((prev) => ({ ...prev, pickUpLocation: location }));
                                },
                                (error) => {
                                    console.error("Error fetching location:", error);
                                }
                            );
                        }}
                        sx={{ marginTop: 2 }}
                    >
                        Use My Location
                    </Button>
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
                        <MenuItem value="Pending">⏳ Pending</MenuItem>
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
                    <Button onClick={() => setOpenViewDialog(false)}>Cancel</Button>
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
                                console.log("Booking Confirmed:", currentBooking);
                                setCurrentBooking((prev) => ({ ...prev, submitted: true }));
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!currentBooking?.submitted}
                onClose={() => setCurrentBooking((prev) => ({ ...prev, submitted: false }))}
            >
                <DialogTitle>Booking Submitted</DialogTitle>
                <DialogContent>
                    <Typography>
                        Your booking has been submitted for review. We will get back to you shortly.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setCurrentBooking((prev) => ({ ...prev, submitted: false }))}
                        color="primary"
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </Box>
    );
};

export default VehiclePage;
