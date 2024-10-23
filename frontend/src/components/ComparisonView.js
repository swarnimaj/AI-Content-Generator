import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import LazyIframe from './LazyIframe';

const ComparisonView = ({ pages }) => {
  return (
    <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Compare Iterations
      </Typography>
      <Grid container spacing={2}>
        {pages.map((page, index) => (
          <Grid item xs={12} md={4} key={page.id}>
            <Typography variant="subtitle1" gutterBottom>
              Iteration {index + 1}
            </Typography>
            <Box
              sx={{
                border: '1px solid #ccc',
                height: '300px',
                overflow: 'auto',
              }}
            >
              <LazyIframe
                srcDoc={page.html}
                title={`Comparison ${index + 1}`}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ComparisonView;
