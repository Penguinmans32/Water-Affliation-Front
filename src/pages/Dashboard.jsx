import { useAuth } from '../context/AuthContext';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
} from '@mui/material';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={6} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h4" gutterBottom>
                    Welcome, {user.username}!
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        User Information
                    </Typography>
                    <Typography>Username: {user.username}</Typography>
                    <Typography>Email: {user.email}</Typography>
                    <Typography>Role: {user.role}</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="error"
                    sx={{ mt: 4 }}
                    onClick={logout}
                >
                    Logout
                </Button>
            </Paper>
        </Container>
    );
};

export default Dashboard;