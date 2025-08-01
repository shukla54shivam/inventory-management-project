import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Products = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Products Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Product management interface will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Products; 