import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    IconButton,
} from "@mui/material";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 10 },
});

const VehiclePDF = ({ vehicle }) => (
    <Document>
        <Page style={styles.page}>
            <View style={{ ...styles.section, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "blue" }}>
                    Vehicle Details
                </Text>
            </View>
            <View style={{ borderWidth: 1, borderColor: "black", marginBottom: 10 }}>
                <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "black" }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "blue", width: "50%", padding: 5 }}>
                        Field
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "blue", width: "50%", padding: 5 }}>
                        Value
                    </Text>
                </View>
                {[
                    { label: "Vehicle Name", value: vehicle.name },
                    { label: "Type", value: vehicle.type },
                    { label: "Fuel", value: vehicle.fuel },
                    { label: "Seats", value: vehicle.seats },
                    { label: "Transmission", value: vehicle.transmission },
                    { label: "Price", value: `$${vehicle.price}` },
                    { label: "Status", value: vehicle.status },
                ].map((item, index) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: "row",
                            borderBottomWidth: index === 6 ? 0 : 1,
                            borderColor: "black",
                        }}
                    >
                        <Text style={{ fontSize: 14, width: "50%", padding: 5 }}>{item.label}</Text>
                        <Text style={{ fontSize: 14, width: "50%", padding: 5 }}>{item.value}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

const VehicleDetails = () => {
    const [vehicles, setVehicles] = useState([]);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ type: "", fuel: "", transmission: "" });

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get("http://localhost:4000/vehicles");
                setVehicles(response.data);
                console.log("Fetched vehicles:", response.data); // Debugging line
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };

        fetchVehicles();

        // Set up polling to refresh data every 10 seconds
        const intervalId = setInterval(fetchVehicles, 10000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const [newVehicle, setNewVehicle] = useState({
        vehicleId: "",
        image: "",
        name: "",
        type: "",
        fuel: "",
        seats: 1,
        transmission: "",
        price: 0,
        status: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOpenUpdateDialog = (vehicle) => {
        if (window.confirm("Do you want to update this vehicle?")) {
            setSelectedVehicle(vehicle);
            setUpdateDialogOpen(true);
        }
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedVehicle((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async () => {
        try {
            const updatedVehicle = { ...selectedVehicle }; // Clone the selectedVehicle object
            const response = await axios.put(
                `http://localhost:4000/vehicles/${updatedVehicle.vehicleId}`,
                updatedVehicle
            );
            setVehicles((prevVehicles) =>
                prevVehicles.map((vehicle) =>
                    vehicle.vehicleId === updatedVehicle.vehicleId ? response.data : vehicle
                )
            );
            setUpdateDialogOpen(false);
        } catch (error) {
            console.error("Error updating vehicle:", error);
        }
    };

    const handleAddVehicle = async () => {
        if (vehicles.some((v) => v.vehicleId === newVehicle.vehicleId)) {
            alert("Vehicle ID already exists!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/vehicles", newVehicle);
            setVehicles((prevVehicles) => [...prevVehicles, response.data]);
            setNewVehicle({
                vehicleId: "",
                image: "",
                name: "",
                type: "",
                fuel: "",
                seats: 1,
                transmission: "",
                price: 0,
                status: "",
            });
        } catch (error) {
            console.error("Error adding vehicle:", error);
        }
    };

    const handleDeleteVehicle = async (vehicleId) => {
        try {
            await axios.delete(`http://localhost:4000/vehicles/${vehicleId}`);
            setVehicles(vehicles.filter((vehicle) => vehicle.vehicleId !== vehicleId));
        } catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    };

    const handleSubmit = () => {
        handleAddVehicle();
        setDialogOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredVehicles = vehicles.filter((vehicle) =>
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filters.type ? vehicle.type === filters.type : true) &&
        (filters.fuel ? vehicle.fuel === filters.fuel : true) &&
        (filters.transmission ? vehicle.transmission === filters.transmission : true)
    );

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Available Vehicles
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
                <Button variant="contained" onClick={() => setDialogOpen(true)}>
                    Add Vehicle
                </Button>
            </Box>
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
                        <Card>
                            <img
                                src={vehicle.image}
                                alt={vehicle.name}
                                style={{ width: "100%", height: 200, objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6">{vehicle.name}</Typography>
                                <Typography color="textSecondary">{vehicle.type}</Typography>
                                <Typography variant="body2">Vehicle ID: {vehicle.vehicleId}</Typography>
                                <Typography variant="body2">Fuel: {vehicle.fuel}</Typography>
                                <Typography variant="body2">Seats: {vehicle.seats}</Typography>
                                <Typography variant="body2">Transmission: {vehicle.transmission}</Typography>
                                <Typography variant="body2">Price: ${vehicle.price}</Typography>
                                <Typography variant="body2">Status: {vehicle.status}</Typography>

                                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                                    <IconButton onClick={() => handleOpenUpdateDialog(vehicle)}>
                                        <FaEdit />
                                    </IconButton>
                                    <PDFDownloadLink
                                        document={<VehiclePDF vehicle={vehicle} />}
                                        fileName={`${vehicle.name}_details.pdf`}
                                    >
                                        <IconButton>
                                            <FaDownload />
                                        </IconButton>
                                    </PDFDownloadLink>
                                    <IconButton
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this vehicle?")) {
                                                handleDeleteVehicle(vehicle.vehicleId);
                                            }
                                        }}
                                    >
                                        <FaTrash />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Update Vehicle Details</DialogTitle>
                <DialogContent>
                    {selectedVehicle && (
                        ["name", "image", "type", "fuel", "seats", "transmission", "price", "status"].map((field) => (
                            <TextField
                                key={field}
                                fullWidth
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                name={field}
                                value={selectedVehicle[field] || ""}
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    const updatedValue =
                                        (name === "seats" || name === "price") && !isNaN(value) && parseInt(value) >= 0
                                            ? parseInt(value)
                                            : name === "seats" || name === "price"
                                            ? selectedVehicle[name]
                                            : value;
                                    setSelectedVehicle((prev) => ({ ...prev, [name]: updatedValue }));
                                }}
                                margin="dense"
                                type={field === "seats" || field === "price" ? "number" : "text"}
                                select={field === "type" && field === "fuel"}
                            >
                                {field === "type" && (
                                    <>
                                        <MenuItem value="">All Types</MenuItem>
                                        <MenuItem value="Sedan">Sedan</MenuItem>
                                        <MenuItem value="SUV">SUV</MenuItem>
                                        <MenuItem value="Truck">Truck</MenuItem>
                                        <MenuItem value="Bus">Bus</MenuItem>
                                        <MenuItem value="Bike">Bike</MenuItem>
                                        <MenuItem value="Van">Van</MenuItem>
                                    </>
                                )}
                                {field === "fuel" && (
                                    <>
                                        <MenuItem value="">All Fuel Types</MenuItem>
                                        <MenuItem value="Petrol">Petrol</MenuItem>
                                        <MenuItem value="Diesel">Diesel</MenuItem>
                                        <MenuItem value="Electric">Electric</MenuItem>
                                        <MenuItem value="Hybrid">Hybrid</MenuItem>
                                        <MenuItem value="CNG">CNG</MenuItem>
                                    </>
                                )}
                            </TextField>
                        ))
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateSubmit} variant="contained">Update</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Vehicle ID" name="vehicleId" value={newVehicle.vehicleId} onChange={handleChange} />
                    <TextField fullWidth label="Image URL" name="image" value={newVehicle.image} onChange={handleChange} />
                    <TextField fullWidth label="Name" name="name" value={newVehicle.name} onChange={handleChange} />
                    <TextField
                        fullWidth
                        label="Type"
                        name="type"
                        value={newVehicle.type}
                        onChange={handleChange}
                        select
                    >
                        <MenuItem value="">All Types</MenuItem>
                        <MenuItem value="Sedan">Sedan</MenuItem>
                        <MenuItem value="SUV">SUV</MenuItem>
                        <MenuItem value="Truck">Truck</MenuItem>
                        <MenuItem value="Bus">Bus</MenuItem>
                        <MenuItem value="Bike">Bike</MenuItem>
                        <MenuItem value="Van">Van</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        label="Fuel Type"
                        name="fuel"
                        value={newVehicle.fuel}
                        onChange={handleChange}
                        select
                    >
                        <MenuItem value="">All Fuel Types</MenuItem>
                        <MenuItem value="Petrol">Petrol</MenuItem>
                        <MenuItem value="Diesel">Diesel</MenuItem>
                        <MenuItem value="Electric">Electric</MenuItem>
                        <MenuItem value="Hybrid">Hybrid</MenuItem>
                        <MenuItem value="CNG">CNG</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        label="Transmission"
                        name="transmission"
                        value={newVehicle.transmission}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Seats"
                        name="seats"
                        value={newVehicle.seats}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            handleChange({ target: { name: "seats", value: !isNaN(value) && value >= 0 ? value : newVehicle.seats } });
                        }}
                        type="number"
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        value={newVehicle.price}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            handleChange({ target: { name: "price", value: !isNaN(value) && value >= 0 ? value : newVehicle.price } });
                        }}
                        type="number"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Add Vehicle
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VehicleDetails;
