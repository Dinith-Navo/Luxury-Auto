import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Grid, Paper, List as MuiList, ListItem, ListItemText, Dialog, DialogActions, DialogTitle, DialogContent, Box, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

const initialTransactions = [
  { id: 1, transactionNumber: 'T1001', description: 'Payment for Vendor A', status: 'Completed', date: '2025-03-01' },
  { id: 2, transactionNumber: 'T1002', description: 'Receipt from Client B', status: 'Pending', date: '2025-03-05' },
  { id: 3, transactionNumber: 'T1003', description: 'Payment for Vendor C', status: 'In Progress', date: '2025-03-10' },
];

const TransactionStatus = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    transactionNumber: '',
    description: '',
    status: 'Pending',
    date: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  // Open Add Transaction dialog
  const handleAddTransaction = () => {
    setOpenDialog(true);
  };

  // Handle saving new transaction
  const handleSaveTransaction = () => {
    const transaction = {
      id: transactions.length + 1,
      ...newTransaction,
    };
    setTransactions([...transactions, transaction]);
    setOpenDialog(false);
    setNewTransaction({ transactionNumber: '', description: '', status: 'Pending', date: '' });
  };

  // Handle viewing transaction details
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenViewDialog(true);
  };

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === id ? { ...transaction, status: newStatus } : transaction
    );
    setTransactions(updatedTransactions);
  };

  // Handle filtering
  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === 'All' || transaction.status === filterStatus)
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
            onClick={handleAddTransaction}
          >
            Add Transaction
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
            placeholder="Search Transaction..."
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
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Archived">Archived</MenuItem>
          </TextField>
        </Box>
        <MuiList sx={{ width: '100%', maxWidth: 800, margin: 'auto' }}>
          {filteredTransactions.map((transaction) => (
            <Paper
              key={transaction.id}
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
                    primary={<Typography variant="h6" fontWeight="bold" color="info">{`Transaction #${transaction.transactionNumber}`}</Typography>}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary" fontWeight="bold">Description: {transaction.description}</Typography>
                        <Typography variant="body2" color="textSecondary" fontWeight="bold">Date: {transaction.date}</Typography>
                        <Typography
                          variant="body2"
                          color={
                            transaction.status === 'Pending'
                              ? 'warning.main'
                              : transaction.status === 'In Progress'
                              ? 'info.main'
                              : 'success.main'
                          }
                          fontWeight="bold"
                        >
                          Status: {transaction.status}
                        </Typography>
                      </>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-end' }} gap={1} flexWrap="wrap">
                    <IconButton color="primary" size="medium" onClick={() => handleViewTransaction(transaction)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="secondary" size="medium">
                      <EditIcon />
                    </IconButton>
                    {transaction.status !== 'Archived' && (
                      <IconButton color="warning" size="medium">
                        <ArchiveIcon />
                      </IconButton>
                    )}
                    {transaction.status === 'Archived' && (
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

        {/* Add New Transaction Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogContent>
            <TextField
              label="Transaction Number"
              fullWidth
              value={newTransaction.transactionNumber}
              onChange={(e) => setNewTransaction({ ...newTransaction, transactionNumber: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Description"
              fullWidth
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                value={newTransaction.status}
                onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveTransaction} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Transaction Dialog */}
        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogContent>
            {selectedTransaction && (
              <>
                <Typography variant="body2" color="textSecondary" fontWeight="bold">Transaction Number: {selectedTransaction.transactionNumber}</Typography>
                <Typography variant="body2" color="textSecondary" fontWeight="bold">Description: {selectedTransaction.description}</Typography>
                <Typography variant="body2" color="textSecondary" fontWeight="bold">Date: {selectedTransaction.date}</Typography>
                <Typography
                  variant="body2"
                  color={
                    selectedTransaction.status === 'Pending'
                      ? 'warning.main'
                      : selectedTransaction.status === 'In Progress'
                      ? 'info.main'
                      : 'success.main'
                  }
                  fontWeight="bold"
                >
                  Status: {selectedTransaction.status}
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

export default TransactionStatus;