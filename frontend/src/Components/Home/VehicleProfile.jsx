import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from "@mui/material";

const VehicleProfile = () => {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/vehicles/${vehicleId}`);
        setVehicle(response.data);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!vehicle) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6">Vehicle not found</Typography>
        <Button variant="contained" component={Link} to="/vehicles" sx={{ mt: 2 }}>
          Back to Vehicles
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Card>
        <img
          src={vehicle.image}
          alt={vehicle.name}
          style={{ width: "100%", height: 300, objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>{vehicle.name}</Typography>
          <Typography variant="body1"><strong>Type:</strong> {vehicle.type}</Typography>
          <Typography variant="body1"><strong>Fuel:</strong> {vehicle.fuel}</Typography>
          <Typography variant="body1"><strong>Seats:</strong> {vehicle.seats}</Typography>
          <Typography variant="body1"><strong>Transmission:</strong> {vehicle.transmission}</Typography>
          <Typography variant="body1"><strong>Price:</strong> ${vehicle.price}</Typography>
          <Typography variant="body1"><strong>Status:</strong> {vehicle.status}</Typography>
        </CardContent>
      </Card>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button variant="contained" component={Link} to="/vehicles">Back to List</Button>
      </Box>
    </Box>
  );
};

export default VehicleProfile;
