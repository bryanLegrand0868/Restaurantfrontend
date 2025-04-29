// src/pages/user/ProfilePage.js
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
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dietaryPreferences: []
  });
  const [favorites, setFavorites] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/users/profile`);
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          dietaryPreferences: response.data.dietaryPreferences || []
        });

        // Get favorites from localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }

        // Fetch order history
        const ordersResponse = await axios.get(`${API_URL}/api/orders/history`);
        setOrderHistory(ordersResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDietaryPreferenceChange = (e) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/users/profile`, formData);
      setEditMode(false);
      setUser(prev => ({
        ...prev,
        ...formData
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const toggleFavorite = (dishId) => {
    const newFavorites = favorites.includes(dishId)
      ? favorites.filter(f => f !== dishId)
      : [...favorites, dishId];

    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

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

  return (
    <Container className="profile-page">
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Dietary Preferences</InputLabel>
                    <Select
                      multiple
                      value={formData.dietaryPreferences}
                      onChange={handleDietaryPreferenceChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="vegetarian">Vegetarian</MenuItem>
                      <MenuItem value="vegan">Vegan</MenuItem>
                      <MenuItem value="gluten-free">Gluten-Free</MenuItem>
                      <MenuItem value="dairy-free">Dairy-Free</MenuItem>
                      <MenuItem value="nut-free">Nut-Free</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                    >
                      Save Changes
                    </Button>
                  </Box>
                </form>
              ) : (
                <Box>
                  <Typography>Name: {user.name}</Typography>
                  <Typography>Email: {user.email}</Typography>
                  <Typography>Phone: {user.phone}</Typography>
                  <Typography>Address: {user.address}</Typography>
                  <Typography>Dietary Preferences: 
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {user.dietaryPreferences.map((pref) => (
                        <Chip key={pref} label={pref} />
                      ))}
                    </Box>
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setEditMode(true)}
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Favorites */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Favorite Dishes
              </Typography>
              {favorites.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No favorite dishes yet. Add dishes to your favorites by clicking the heart icon on any dish.
                </Typography>
              ) : (
                <List>
                  {favorites.map((dishId, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Dish #${dishId}`}
                        secondary="Click to view details"
                      />
                      <IconButton 
                        edge="end" 
                        aria-label="remove favorite"
                        onClick={() => toggleFavorite(dishId)}
                      >
                        <FavoriteIcon color="error" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order History */}
      <Card className="order-history-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order History
          </Typography>
          {orderHistory.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No orders yet. Start exploring our menu!
            </Typography>
          ) : (
            <List>
              {orderHistory.map((order, index) => (
                <React.Fragment key={order.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Order #${order.id}`}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                          {' — '}
                          <Typography
                            component="span"
                            variant="body2"
                            color={order.status === 'completed' ? 'success.main' : 'warning.main'}
                          >
                            {order.status}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
