// src/pages/user/OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/constants';

// Material UI imports
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TimelineIcon from '@mui/icons-material/Timeline';

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
        <Typography variant="h6" gutterBottom>
          Order #{order.id}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {new Date(order.createdAt).toLocaleDateString()}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} align="right"><strong>Total:</strong></TableCell>
                <TableCell align="right"><strong>${order.total.toFixed(2)}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2 }}>
          <Typography>Status: {order.status}</Typography>
          <Typography>Payment Method: {order.paymentMethod}</Typography>
        </Box>
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
            No Orders Found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            You haven't placed any orders yet. Start exploring our menu!
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/menu"
            sx={{ mt: 2 }}
          >
            Browse Menu
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card className="order-card">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Order #{order.id}
                    </Typography>
                    <Typography variant="subtitle1" color={order.status === 'completed' ? 'success.main' : 'warning.main'}>
                      {order.status}
                    </Typography>
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
                            <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} align="right"><strong>Total:</strong></TableCell>
                          <TableCell align="right"><strong>${order.total.toFixed(2)}</strong></TableCell>
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
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Payment Details
                    </Typography>
                    <Typography>Method: {order.paymentMethod}</Typography>
                    <Typography>Status: {order.paymentStatus}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrderHistoryPage;