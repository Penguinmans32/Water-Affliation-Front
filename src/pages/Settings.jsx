import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  Alert,
} from '@mui/material';
import api from '../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('file', file);

      console.log('Current token: ', user.token);

      const response = await api.post('/user/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });


      const updatedUserData = await api.get('/user/profile');
      updateUser({
        ...user,
        profilePictureUrl: updatedUserData.data.profilePictureUrl,
      })

      setSuccess('Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError(error.response?.data?.message || 'An error occurred while uploading the profile picture.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4}}>
      <Paper elevation={6} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            src={user.profilePictureUrl}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-picture-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="profile-picture-upload">
            <Button
              variant="contained"
              component="span"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Profile Picture'}
            </Button>
          </label>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          <Typography>Username: {user.username}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Role: {user.role}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;