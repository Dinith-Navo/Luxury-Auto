// Import necessary dependencies
import React, { useState } from 'react';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Select, FormControl, InputLabel, Button, Box, Grid, IconButton, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

// Sample transaction data
const initialTransactions = [
    { id: 1, date: '2025-03-01', amount: 500, status: 'Completed' },
    { id: 2, date: '2025-03-02', amount: 300, status: 'Pending' },
    { id: 3, date: '2025-03-03', amount: 700, status: 'Failed' },
    { id: 4, date: '2025-03-04', amount: 200, status: 'Completed' },
];

function FinancialTransactions() {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [filter, setFilter] = useState({ date: '', status: '', amount: '' });
    const [sort, setSort] = useState({ key: 'date', order: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Handle sorting
    const handleSort = (key) => {
        const order = sort.key === key && sort.order === 'asc' ? 'desc' : 'asc';
        const sortedTransactions = [...transactions].sort((a, b) => {
            if (key === 'amount') {
                return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
            }
            return order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
        });
        setTransactions(sortedTransactions);
        setSort({ key, order });
    };

    // Handle filtering
    const filteredTransactions = transactions.filter((transaction) => {
        return (
            (filter.date === '' || transaction.date.includes(filter.date)) &&
            (filter.status === '' || transaction.status === filter.status) &&
            (filter.amount === '' || transaction.amount.toString().includes(filter.amount)) &&
            transaction.date.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (filterStatus === "All" || transaction.status === filterStatus)
        );
    });

    // Handle date filter change
    const handleDateFilterChange = (e) => {
        setFilter({ ...filter, date: e.target.value });
    };

    // Add date filter input



    const handleViewTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setOpenDialog(true);
    };

    return (
        <div style={{ padding: "10px", backgroundColor: "rgb(253, 253, 227)", minHeight: "100vh" }}>
            <Container>
                <Box textAlign="left" my={4}>
                    <TextField
                        label="Filter by Date"
                        type="date"
                        variant="outlined"
                        value={filter.date}
                        onChange={handleDateFilterChange}
                        sx={{ mx: 2, my: 1 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ px: 3, py: 1, borderRadius: 2, fontSize: "1rem", mx: 2, my: 1 }}
                    >
                        Add Transaction
                    </Button>
                      <Button
                                          variant="contained"
                                          color="secondary"
                                          sx={{ px: 3, py: 1, borderRadius: 2, fontSize: "1rem", mx: 2, my: 1 }}
                                          onClick={() => setFilterStatus('Pending')}
                                      >
                                          View Pending Payments
                                      </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ px: 3, py: 1, borderRadius: 2, fontSize: "1rem", mx: 2, my: 1 }}
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
                            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
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
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                        <MenuItem value="Archived">Archived</MenuItem>
                    </TextField>

                </Box>
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Date</TableCell>
                                <TableCell onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>Amount ($)</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>{transaction.amount}</TableCell>
                                    <TableCell>{transaction.status}</TableCell>
                                    <TableCell>
                                        <Box display="flex" justifyContent="flex-end" gap={1}>
                                            <IconButton color="primary" size="medium" onClick={() => handleViewTransaction(transaction)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton color="secondary" size="medium">
                                                <EditIcon />
                                            </IconButton>
                                            {transaction.status !== "Archived" && (
                                                <IconButton color="warning" size="medium">
                                                    <ArchiveIcon />
                                                </IconButton>
                                            )}
                                            {transaction.status === "Archived" && (
                                                <IconButton color="success" size="medium">
                                                    <UnarchiveIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* View Transaction Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Transaction Details</DialogTitle>
                    <DialogContent>
                        {selectedTransaction && (
                            <>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold">Date: {selectedTransaction.date}</Typography>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold">Amount: ${selectedTransaction.amount}</Typography>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold">Status: {selectedTransaction.status}</Typography>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
}



export default FinancialTransactions;