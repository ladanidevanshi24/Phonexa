import React, { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { Context } from "../../utils/context";
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
  Chip,
} from "@mui/material";
import Loader from "../Loader/Loader";

const OrderHistory = () => {
    const { user } = useContext(Context);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = user?._id || user?.id;
        if (userId) {
            fetchOrders(userId);
        } else {
          setLoading(false);
        }
    }, [user]);

    const fetchOrders = async (userId) => {
        try {
            const res = await api.get(`/booking/user/${userId}`);
            if (res.data.success === 1) {
                setOrders(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch order history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Loader />
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#8e2de2", mb: 4 }}>
                My Purchase History
            </Typography>
            {!orders.length ? (
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6">You haven't placed any orders yet.</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="orders table">
                        <TableHead sx={{ bgcolor: "#F5F5F5" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Products</TableCell>
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
                                        {order.products.map((item, idx) => (
                                            <Box key={idx} sx={{ mb: 1 }}>
                                                <Typography variant="body2">
                                                    {item.productId?.productName} x {item.quantity}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        &#8377;{order.totalAmount}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={order.status} 
                                            size="small" 
                                            color="success" 
                                            variant="outlined" 
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

export default OrderHistory;
