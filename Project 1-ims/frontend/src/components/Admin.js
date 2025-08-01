import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Admin = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Admin panel interface will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Admin; 