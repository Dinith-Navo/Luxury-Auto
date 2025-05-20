import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Select, MenuItem, InputAdornment, IconButton, Typography
} from "@mui/material";
import { Add, Edit, Delete, Download, Search } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SaleDetails = () => {
  const [Sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  React.useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:4000/sales");
      if (!response.ok) {
        throw new Error("Failed to fetch sales");
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const handleOpenAddDialog = (sale = null) => {
    setCurrentSale(
      sale || {
        saleId: `B00${sales.length + 1}`,
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

  const handleOpenDialog = (sale = null) => {
    setCurrentSale(
      sale || {
        saleId: `S00${sales.length + 1}`,
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

  const handleSaveSale = async () => {
    try {
      // Update existing sale
      const response = await fetch(
        `http://localhost:4000/sales/${currentSale._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentSale),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update sale");
      }

      fetchSales();
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Error saving sale:", error);
    }
  };

  const handleAddSale = async () => {
    try {
      if (currentSale.saleId.startsWith("B00")) {
        // Create new sale
        const response = await fetch("http://localhost:4000/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentSale),
        });
        if (!response.ok) {
          throw new Error("Failed to create sale");
        }
      }
      fetchSales();
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Error saving sale:", error);
    }
  };

  const handleDeleteSale = async (_id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/vehiclesales/${_id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete sale");
      }
      fetchSales();
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const filteredSales = sales.filter((sale) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (sale.customerId.toLowerCase().includes(searchLower) ||
        sale.vehicleId.toLowerCase().includes(searchLower) ||
        sale.pickUpLocation.toLowerCase().includes(searchLower)) &&
      (filterStatus === "" || sale.status === filterStatus)
    );
  });

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.text("Sale Details", 14, 10);
    doc.autoTable({
      head: [
        [
          "Sale ID",
          "Customer ID",
          "Vehicle ID",
          "Pick-up Location",
          "Status",
          "Date From",
          "Date To",
        ],
      ],
      body: sales.map((sale) => [
        sale.saleId,
        sale.customerId,
        sale.vehicleId,
        sale.pickUpLocation,
        sale.status,
        sale.dateFrom,
        sale.dateTo,
      ]),
    });
    doc.save("sale_details.pdf");
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🚗 Sale Management
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
          Add Sale
        </Button>
      </div>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#eeeeee" }}>
              <TableCell><b>Sale ID</b></TableCell>
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
            {filteredSales.map((sale) => (
              <TableRow key={sale.saleId} hover>
                <TableCell>{sale.saleId}</TableCell>
                <TableCell>{sale.customerId}</TableCell>
                <TableCell>{sale.vehicleId}</TableCell>
                <TableCell>{sale.pickUpLocation}</TableCell>
                <TableCell>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor:
                        sale.status === "Confirmed"
                          ? "#4caf50"
                          : sale.status === "Pending"
                            ? "#ff9800"
                            : "#f44336",
                      color: "white",
                    }}
                  >
                    {sale.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(sale.dateFrom).toLocaleDateString()} <br />
                  <small>{new Date(sale.dateFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </TableCell>
                <TableCell>
                  {new Date(sale.dateTo).toLocaleDateString()} <br />
                  <small>{new Date(sale.dateTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(sale)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete Sale ${sale.saleId}?`
                        )
                      ) {
                        handleDeleteSale(sale._id);
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handlePrintPDF(sale)}>
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
          {currentSale?.saleId ? "✏️ Edit Sale" : "➕ Add Sale"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Customer ID"
            value={currentSale?.customerId || ""}
            onChange={(e) =>
              setCurrentSale({ ...currentSale, customerId: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Vehicle ID"
            value={currentSale?.vehicleId || ""}
            onChange={(e) =>
              setCurrentSale({ ...currentSale, vehicleId: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Pick-up Location"
            value={currentSale?.pickUpLocation || ""}
            onChange={(e) =>
              setCurrentSale({ ...currentSale, pickUpLocation: e.target.value })
            }
          />
          <Select
            fullWidth
            value={currentSale?.status || ""}
            onChange={(e) =>
              setCurrentSale({ ...currentSale, status: e.target.value })
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
            value={currentSale?.dateFrom || ""}
            onChange={(e) => {
              const selectedDate = e.target.value;
              const today = new Date().toISOString().split("T")[0];
              if (selectedDate < today) {
                alert("Date From cannot be in the past.");
              } else {
                setCurrentSale({ ...currentSale, dateFrom: selectedDate });
              }
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Date To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentSale?.dateTo || ""}
            onChange={(e) => {
              const selectedDate = e.target.value;
              if (currentSale?.dateFrom && selectedDate < currentSale.dateFrom) {
                alert("Date To cannot be before Date From.");
              } else {
                setCurrentSale({ ...currentSale, dateTo: selectedDate });
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
                currentSale?.dateFrom &&
                currentSale?.dateTo &&
                currentSale.dateTo < currentSale.dateFrom
              ) {
                alert("Date To cannot be before Date From.");
              } else {
                handleSaveSale();
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
          {currentSale?.saleId ? "➕ Add Sale" : "➕ Add Sale"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Customer ID"
            value={currentSale?.customerId || ""}
            onChange={(e) =>
              setCurrentSale({ ...currentSale, customerId: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Vehicle ID"
            value={currentSale?.vehicleId || ""}
            onChange={(e) =>
              setCurrentSale({ ...currentSale, vehicleId: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Pick-up Location"
            value={currentSale?.pickUpLocation || ""}
            onChange={(e) =>
              setCurrentSale({ ...currentSale, pickUpLocation: e.target.value })
            }
          />
          <Select
            fullWidth
            value={currentSale?.status || ""}
            onChange={(e) =>
              setCurrentSale({ ...currentSale, status: e.target.value })
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
            value={currentSale?.dateFrom || ""}
            onChange={(e) => {
              const selectedDateTime = e.target.value;
              const now = new Date().toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'

              if (selectedDateTime < now) {
                alert("Date From cannot be in the past.");
              } else {
                setCurrentSale({ ...currentSale, dateFrom: selectedDateTime });
              }
            }}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Date To"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={currentSale?.dateTo || ""}
            onChange={(e) => {
              const selectedDateTime = e.target.value;
              const now = new Date().toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'

              if (selectedDateTime < now) {
                alert("Date From cannot be in the past.");
              } else {
                setCurrentSale({ ...currentSale, dateTo: selectedDateTime });
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
                currentSale?.dateFrom &&
                currentSale?.dateTo &&
                currentSale.dateTo < currentSale.dateFrom
              ) {
                alert("Date To cannot be before Date From.");
              } else {
                handleAddSale();
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

export default SaleDetails;
