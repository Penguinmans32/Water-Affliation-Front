import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/auth.service';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { WaterDrop } from '@mui/icons-material';
import '../styles/Login.css';


const Ripple = ({ top, left }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: '1px',
        height: '1px',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '50%',
        animation: 'ripple 1s linear',
      }}
    />
  );
};

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [ripples, setRipples] = useState([]);
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    useEffect(() => {
        const interval = setInterval(() => {
            const newRipple = {
                id: Date.now(),
                top: Math.random() * window.innerHeight,
                left: Math.random() * window.innerWidth,
            };
            setRipples(prevRipples => [...prevRipples, newRipple]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (ripples.length > 10) {
            setRipples(prevRipples => prevRipples.slice(1));
        }
    }, [ripples]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.login(usernameOrEmail, password);
            console.log('Login response:', response.data); 

            if(!response.data.token) {
                throw new Error('Token not found in response');
            }
            
            authLogin(response.data);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="water-login-container">
            {ripples.map(ripple => (
                <Ripple key={ripple.id} top={ripple.top} left={ripple.left} />
            ))}
            <div className="water-bubbles">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="bubble"></div>
                ))}
            </div>
            <Container component="main" maxWidth="xs">
                <Paper elevation={6} className="login-paper" sx={{ p: 4 }}>
                    <Typography component="h1" variant="h4" className="login-title" textAlign="center">
                        <WaterDrop sx={{ fontSize: 40, marginRight: 1 }} />
                        Aqua Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        {error && (
                            <Typography color="error" textAlign="center" mb={2}>
                                {error}
                            </Typography>
                        )}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username or Email"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            className="login-input"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className="login-button"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/register')}
                            className="signup-link"
                        >
                            Don't have an account? Sign Up
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
};

export default Login;

