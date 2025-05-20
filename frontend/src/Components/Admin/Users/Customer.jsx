import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Edit, Delete, Print, Add } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddUser from './AddUser';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/users";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function Customer() {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [view, setView] = useState('table'); // For toggling views (table or stats)

  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => {
      setAllUsers(data);
      setUsers(data);
    }).catch(error => {
      console.error("Error fetching users:", error);
    });
  }, []);

  const handleEdit = (userId) => {
    navigate(`/admindashboard/update-user/${userId}`);
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${URL}/${userId}`);
      if (response.status === 200) {
        setAllUsers(prev => prev.filter(user => user.userId !== userId));
        setUsers(prev => prev.filter(user => user.userId !== userId));
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting user:", error.response ? error.response.data : error.message);
    }
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    
    // Add the main topic as the title
    doc.setFontSize(18);
    doc.text("LUXURY AUTOS", 10, 10);
    
    // Add a subtitle or description if needed
    doc.setFontSize(12);
    doc.text("User Details Report", 10, 20);

    doc.autoTable({
      head: [['User ID', 'Username', 'Name', 'Email', 'Phone', 'Type']],
      body: users.map(user => [user.userId, user.userName, user.name, user.email, user.phone, user.type]),
      startY: 30, // Adjust the starting position to leave space for the title
      margin: { top: 20 },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
      },
    });

    doc.save('user-details.pdf');
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setUsers(allUsers);
      setNoResults(false);
      return;
    }

    const filteredUsers = allUsers.filter(user =>
      Object.values(user).some(field =>
        field && field.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    setUsers(filteredUsers);
    setNoResults(filteredUsers.length === 0);
  };

  const handleAddUser = () => {
    setShowAddUserForm(true);
  };

  const handleBack = () => {
    setShowAddUserForm(false);
  };

  // Calculate statistics
  const totalUsers = users.length;
  const userTypeDistribution = users.reduce((acc, user) => {
    acc[user.type] = (acc[user.type] || 0) + 1;
    return acc;
  }, {});

  // Render the statistics view
  const renderStatsView = () => (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>Total Users: {totalUsers}</Typography>
      <Typography variant="h6" gutterBottom>User Types Distribution:</Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Type</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(userTypeDistribution).map(([type, count]) => (
              <TableRow key={type}>
                <TableCell>{type}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Handle view change
  const handleViewChange = (event, newView) => {
    setView(newView);
  };

  return (
    <Box>
      {showAddUserForm ? (
        <Box>
          <AddUser onBack={handleBack} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
              sx={{
                flexShrink: 1,
                width: '200px',
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              sx={{ marginLeft: 'auto' }}
            >
              <ToggleButton value="table">Table View</ToggleButton>
              <ToggleButton value="stats">Stats View</ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddUser}
              sx={{ borderRadius: 2, marginLeft: 2 }}
              startIcon={<Add />}
            >
              Add Customer
            </Button>
          </Box>

          {view === 'table' ? (
            <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
              <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User ID</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {noResults ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">No users found.</TableCell>
                      </TableRow>
                    ) : (
                      users.filter(user => user.type === 'customer').map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell>{user.userId}</TableCell>
                          <TableCell>{user.userName}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>{user.type}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(user.userId)} sx={{ color: 'primary.main' }}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => deleteUser(user.userId)} sx={{ color: 'error.main' }}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="contained"
                color="primary"
                onClick={handlePDF}
                sx={{ marginTop: 2, borderRadius: 2 }}
              >
                <Print /> Download
              </Button>
            </Box>
          ) : (
            renderStatsView()
          )}
        </>
      )}
    </Box>
  );
}

export default Customer;
