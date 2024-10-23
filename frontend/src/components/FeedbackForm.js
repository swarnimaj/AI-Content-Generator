import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const FeedbackForm = ({ onSubmit, iterationCount }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedback);
    setFeedback('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Provide Feedback (Iteration {iterationCount}/5)
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="What would you like to change or improve?"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!feedback || iterationCount >= 5}
        sx={{ mt: 2 }}
      >
        Generate New Options
      </Button>
      {iterationCount >= 5 && (
        <Typography color="error" sx={{ mt: 2 }}>
          You've reached the maximum number of iterations. Please start a new session.
        </Typography>
      )}
    </Box>
  );
};

export default FeedbackForm;
