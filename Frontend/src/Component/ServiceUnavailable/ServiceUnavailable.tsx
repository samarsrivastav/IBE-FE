import React from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

const ServiceUnavailable: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Refresh the page to check if service is back
    window.location.reload();
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: { xs: '1rem', sm: '2rem' }
      }}
    >
      <Box 
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: { xs: '2rem 1rem', sm: '3rem 2rem' },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          width: '100%'
        }}
      >
        <ErrorOutlineIcon 
          sx={{ 
            fontSize: { xs: '4rem', sm: '5rem' }, 
            color: '#f44336',
            marginBottom: '1rem'
          }} 
        />
        
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            marginBottom: '1rem',
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          Service Unavailable
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            marginBottom: '2rem',
            color: '#666',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          We apologize for the inconvenience. The booking service is currently unavailable.
          Our team has been notified and is working to restore service as soon as possible.
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: '1rem' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRetry}
            sx={{ 
              minWidth: '120px',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Try Again
          </Button>
          
          <Button 
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ 
              minWidth: '120px',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ServiceUnavailable; 