import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
} from "@mui/material";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const res = await api.get(`/booking/getall`);
            if (res.data.success === 1) {
                setOrders(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch all orders for administrator");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2", mb: 4 }}>
                Platform Order Management
            </Typography>
            {!orders.length ? (
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6">No orders found in the system.</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="all orders table">
                        <TableHead sx={{ bgcolor: "#E3F2FD" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Items</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Total Amount</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {typeof order.userId === 'object' && order.userId !== null ? (
                                            <>
                                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                                    {order.userId.firstName} {order.userId.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {order.userId.email}
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                                                    System Administrator
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {order.userId || "Static Admin"}
                                                </Typography>
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {order.products.map((item, idx) => (
                                            <Box key={idx} sx={{ mb: 0.5 }}>
                                                <Typography variant="caption" display="block">
                                                    • {item.productId?.productName} (x{item.quantity})
                                                </Typography>
                                            </Box>
                                        ))}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                                        &#8377;{order.totalAmount}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={order.status} 
                                            size="small" 
                                            color="primary" 
                                            variant="contained" 
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default AdminOrders;
