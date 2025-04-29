// src/pages/user/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    Divider,
    IconButton,
    Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleOrderHistory = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/orders/history`);
            setOrderHistory(response.data);
        } catch (error) {
            console.error('Error fetching order history:', error);
            setError('Failed to load order history');
        }
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
                                            renderValue={(selected) => selected.join(', ')}
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
                                    <Typography>Dietary Preferences: {user.dietaryPreferences.join(', ')}</Typography>
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

                {/* Order History */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Order History
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleOrderHistory}
                                sx={{ mb: 2 }}
                            >
                                Load Order History
                            </Button>
                            {orderHistory.length > 0 && (
                                <List>
                                    {orderHistory.map((order, index) => (
                                        <React.Fragment key={order.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={`Order #${order.id}`}
                                                    secondary={`Date: ${new Date(order.createdAt).toLocaleDateString()}`}
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProfilePage;