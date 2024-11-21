import { useAuth } from '../context/AuthContext';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Avatar,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import WebSocketService from '../services/WebSocketService';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [waterData, setWaterData] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const maxDataPoints = 20; 

    useEffect(() => {
        const handleWaterQualityData = (data) => {
            setWaterData(prevData => {
                const newData = [...prevData, {
                    ...data,
                    pH: Number(data.ph),
                    oxygenLevel: Number(data.oxygenLevel),
                    waterLevel: Number(data.waterLevel),
                    temperature: Number(data.temperature),
                    timestamp: new Date(data.timestamp).toLocaleTimeString()
                }];
                console.log('Updated water data: ', newData);
                return newData.slice(-maxDataPoints);
            });
        };

        try {
            WebSocketService.connect(handleWaterQualityData);
        }catch (error) {
            console.error('Error connecting to WebSocket: ', error);
        }

        return () => {
            WebSocketService.disconnect();
        };
    }, []);

    useEffect(() => {
        const checkConnection = setInterval(() => {
            setIsConnected(WebSocketService.isConnected());
        }, 1000);

        return () => clearInterval(checkConnection);
    }, []);

    // Get current readings
    const getCurrentReadings = () => {
        if (waterData.length === 0) return null;
        return waterData[waterData.length - 1];
    };

    const hanldeReconnect = () => {
        WebSocketService.reconnect();
    }

    const currentReadings = getCurrentReadings();

    const ConnectionStatus = () => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
                Connection Status:
            </Typography>
            <Box
                sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: isConnected ? 'success.main' : 'error.main',
                    mr: 1
                }}
            />
            <Typography variant="body2">
                {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
            {!isConnected && (
                <Button
                    size="small"
                    onClick={hanldeReconnect}
                    sx={{ ml: 2 }}
                >
                    Reconnect
                </Button>
            )}
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={6} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                        src={user.profilePictureUrl}
                        sx={{ width: 64, height: 64, mr: 2 }}
                    />
                    <Typography component="h1" variant="h4" gutterBottom>
                        Welcome, {user.username}!
                    </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        User Information
                    </Typography>
                    <Typography>Username: {user.username}</Typography>
                    <Typography>Email: {user.email}</Typography>
                    <Typography>Role: {user.role}</Typography>
                </Box>
            </Paper>

            <Typography variant="h4" sx={{ mb: 3 }}>
                Water Quality Monitoring
            </Typography>

            <ConnectionStatus />

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'primary.light' }}>
                        <CardContent>
                            <Typography color="white" gutterBottom>
                                pH Level Over Time
                            </Typography>
                            <Typography variant="h4" color="white">
                                {currentReadings?.ph?.toFixed(2) || '-'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'success.light' }}>
                        <CardContent>
                            <Typography color="white" gutterBottom>
                                Oxygen Level (mg/L)
                            </Typography>
                            <Typography variant="h4" color="white">
                                {currentReadings?.oxygenLevel?.toFixed(2) || '-'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'info.light' }}>
                        <CardContent>
                            <Typography color="white" gutterBottom>
                                Water Level (cm)
                            </Typography>
                            <Typography variant="h4" color="white">
                                {currentReadings?.waterLevel?.toFixed(2) || '-'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'warning.light' }}>
                        <CardContent>
                            <Typography color="white" gutterBottom>
                                Temperature (°C)
                            </Typography>
                            <Typography variant="h4" color="white">
                                {currentReadings?.temperature?.toFixed(2) || '-'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            pH Levels Over Time
                        </Typography>
                        <ResponsiveContainer>
                            <LineChart data={waterData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[6, 9]} />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="pH" 
                                    stroke="#8884d8" 
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            Oxygen Levels Over Time
                        </Typography>
                        <ResponsiveContainer>
                            <LineChart data={waterData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[0, 15]} />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="oxygenLevel" 
                                    stroke="#82ca9d" 
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Logout Button */}
            <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={logout}
                >
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default Dashboard;