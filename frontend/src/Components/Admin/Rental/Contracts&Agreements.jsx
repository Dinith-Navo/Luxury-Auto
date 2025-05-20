import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Grid, Paper, List as MuiList, ListItem, ListItemText, Dialog, DialogActions, DialogTitle, DialogContent, Box, IconButton, MenuItem } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { Contracts } from '../Database/Data';

const ContractsAndAgreements = () => {
  const [contracts, setContracts] = useState(Contracts);
  const [openDialog, setOpenDialog] = useState(false);
  const [newContract, setNewContract] = useState({ date: '', title: '', status: 'Pending' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedContract, setSelectedContract] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  // Open Add Contract dialog
  const handleAddContract = () => {
    setOpenDialog(true);
  };

  // Handle saving new contract
  const handleSaveContract = () => {
    const contract = {
      id: contracts.length + 1,
      ...newContract,
    };
    setContracts([...contracts, contract]);
    setOpenDialog(false);
    setNewContract({ date: '', title: '', status: 'Pending' });
  };

  // Handle viewing contract details
  const handleViewContract = (contract) => {
    setSelectedContract(contract);
    setOpenViewDialog(true);
  };

  // Handle filtering
  const filteredContracts = contracts.filter((contract) => {
    return (
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === 'All' || contract.status === filterStatus)
    );
  });

  return (
    <div style={{ padding: '10px', backgroundColor: 'rgb(253, 253, 227)', minHeight: '100vh' }}>
      <Container>
        <Box textAlign="left" my={4}>
          <Button
            variant="contained"
            color="success"
            sx={{ px: 3, py: 1, borderRadius: 2, fontSize: '1rem', mx: 2, my: 1 }}
            onClick={handleAddContract}
          >
            Add Contract
          </Button>
          <Button
            variant="contained"
            color="warning"
            sx={{ px: 3, py: 1, borderRadius: 2, fontSize: '1rem', mx: 2, my: 1 }}
            onClick={() => setFilterStatus('Archived')}
          >
            View Archive
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 3, py: 1, borderRadius: 2, fontSize: '1rem', mx: 2, my: 1 }}
            onClick={() => setFilterStatus('All')}
          >
            View All
          </Button>
          <TextField
            marginRight={2}
            variant="outlined"
            placeholder="Search Contract..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ mx: 2, my: 1 }}
          />
          <TextField
            select
            variant="outlined"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ mx: 2, my: 1 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Archived">Archived</MenuItem>
          </TextField>
        </Box>
        <MuiList sx={{ width: '100%', maxWidth: 800, margin: 'auto' }}>
          {filteredContracts.map((contract) => (
            <Paper
              key={contract.id}
              elevation={4}
              sx={{
                margin: '12px 0',
                padding: 2,
                borderRadius: 3,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <ListItemText
                    primary={<Typography variant="h6" fontWeight="bold" color="info">{contract.title}</Typography>}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary" fontWeight="bold">Date: {contract.date}</Typography>
                        <Typography
                          variant="body2"
                          color={
                            contract.status === 'Pending'
                              ? 'warning.main'
                              : contract.status === 'Completed'
                              ? 'success.main'
                              : 'textSecondary'
                          }
                          fontWeight="bold"
                        >
                          Status: {contract.status}
                        </Typography>
                      </>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-end' }} gap={1} flexWrap="wrap">
                    <IconButton color="primary" size="medium" onClick={() => handleViewContract(contract)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="secondary" size="medium">
                      <EditIcon />
                    </IconButton>
                    {contract.status !== 'Archived' && (
                      <IconButton color="warning" size="medium">
                        <ArchiveIcon />
                      </IconButton>
                    )}
                    {contract.status === 'Archived' && (
                      <IconButton color="success" size="medium">
                        <UnarchiveIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </MuiList>

        {/* Add New Contract Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Contract</DialogTitle>
          <DialogContent>
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={newContract.date}
              onChange={(e) => setNewContract({ ...newContract, date: e.target.value })}
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Contract Title"
              fullWidth
              value={newContract.title}
              onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Status"
              fullWidth
              value={newContract.status}
              onChange={(e) => setNewContract({ ...newContract, status: e.target.value })}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveContract} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Contract Dialog */}
        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
          <DialogTitle>Contract Details</DialogTitle>
          <DialogContent>
            {selectedContract && (
              <>
                <Typography variant="body2" color="textSecondary" fontWeight="bold">Date: {selectedContract.date}</Typography>
                <Typography variant="body2" color="textSecondary" fontWeight="bold">Title: {selectedContract.title}</Typography>
                <Typography
                  variant="body2"
                  color={
                    selectedContract.status === 'Pending'
                      ? 'warning.main'
                      : selectedContract.status === 'Completed'
                      ? 'success.main'
                      : 'textSecondary'
                  }
                  fontWeight="bold"
                >
                  Status: {selectedContract.status}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ContractsAndAgreements;