import { useAuth } from '../context/AuthContext';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Avatar,
} from '@mui/material';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4}}>
            <Paper elevation={6} sx={{ p: 4, mt: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3}}>
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