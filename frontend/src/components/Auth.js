import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Tab, 
  Tabs, 
  styled,
  Fade
} from '@mui/material';
import { login, signup } from '../services/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  margin: '40px auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(15, 23, 42, 0.8)', // Dark background
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
}));

const Auth = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(username, email, password);
      }
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(45deg, #0F172A 30%, #1E293B 90%)', // Dark gradient background
    }}>
      <Fade in={true} timeout={1000}>
        <StyledPaper elevation={6}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
            {isLogin ? 'Welcome' : 'Join Us'}
          </Typography>
          <Tabs 
            value={isLogin ? 0 : 1} 
            onChange={(e, newValue) => setIsLogin(newValue === 0)} 
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ mb: 3, width: '100%' }}
          >
            <Tab label="Login" sx={{ color: 'white' }} />
            <Tab label="Sign Up" sx={{ color: 'white' }} />
          </Tabs>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {!isLogin && (
              <StyledTextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}
            <StyledTextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <StyledTextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <StyledButton
              type="submit"
              fullWidth
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </StyledButton>
          </Box>
        </StyledPaper>
      </Fade>
    </Box>
  );
};

export default Auth;