// src/pages/user/OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, formatPrice } from '../../config/constants';

// Material UI imports
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Avatar,
    Box,
    Paper
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/orders/history`);
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load order history');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <Typography>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Paper className="error-message">
                    <Typography color="error">{error}</Typography>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </Paper>
            </Container>
        );
    }

    const renderOrderDetails = (order) => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        Order #{order.id}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                            label={order.status}
                            color={order.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                        />
                        <Chip
                            label={order.paymentStatus}
                            color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                            size="small"
                        />
                    </Box>
                </Box>
                
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    {new Date(order.createdAt).toLocaleDateString()}
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Extras</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={item.imageUrl} />
                                            <Typography>{item.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">{formatPrice(item.price)}</TableCell>
                                    <TableCell align="right">
                                        {item.extras && item.extras.length > 0 && (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {item.extras.map((extra, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={extra.name}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                                <TableCell align="right"><strong>{formatPrice(order.total)}</strong></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Delivery Information
                    </Typography>
                    <Typography>Address: {order.deliveryAddress}</Typography>
                    <Typography>Phone: {order.phone}</Typography>
                    <Typography>Delivery Time: {order.deliveryTime}</Typography>
                    <Typography>Delivery Instructions: {order.deliveryInstructions}</Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Payment Details
                    </Typography>
                    <Typography>Method: {order.paymentMethod}</Typography>
                    <Typography>Payment Status: {order.paymentStatus}</Typography>
                    <Typography>Transaction ID: {order.transactionId}</Typography>
                </Box>

                {order.status === 'pending' && (
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => navigate('/cart')}
                        >
                            Return to Cart
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Container className="order-history-page">
            <Typography variant="h4" component="h1" gutterBottom>
                Order History
            </Typography>

            {orders.length === 0 ? (
                <Paper className="no-orders">
                    <Typography variant="h6" gutterBottom>
                        No Orders Yet
                    </Typography>
                    <Typography color="textSecondary">
                        Start exploring our menu and place your first order!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => navigate('/menu')}
                    >
                        Browse Menu
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((order, index) => (
                        <Grid item xs={12} key={index}>
                            {renderOrderDetails(order)}
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default OrderHistoryPage;