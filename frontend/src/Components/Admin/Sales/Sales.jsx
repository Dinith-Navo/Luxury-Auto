import { useState, useEffect } from 'react';
import axios from 'axios';

const Sales = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        axios.get('/api/sales')
            .then(res => setSales(res.data))
            .catch(err => console.error('Error fetching sales:', err));
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Sales</h2>
            <ul className="border rounded p-4 shadow-md">
                {sales.length > 0 ? (
                    sales.map(sale => (
                        <li key={sale._id} className="p-2 border-b last:border-none">
                            <strong>Vehicle:</strong> {sale.vehicleId} | <strong>Total:</strong> ${sale.totalAmount} | <strong>Status:</strong> {sale.paymentStatus}
                        </li>
                    ))
                ) : (
                    <p>No sales available</p>
                )}
            </ul>
        </div>
    );
};

export default Sales;
