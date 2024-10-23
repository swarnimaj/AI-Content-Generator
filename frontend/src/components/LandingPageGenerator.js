import React, { useState, useCallback } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Switch, FormControlLabel } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLandingPages } from '../services/api';
import PagePreview from './PagePreview';
import FeedbackForm from './FeedbackForm';
import Notification from './Notification';
import ComparisonView from './ComparisonView';

const LandingPageGenerator = () => {
  const [allGeneratedPages, setAllGeneratedPages] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedPages, setGeneratedPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [iterationCount, setIterationCount] = useState(0);

  const showNotification = useCallback((message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  }, []);

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleGenerate = async (feedbackPrompt = '') => {
    setIsLoading(true);
    try {
      const pages = await generateLandingPages(prompt, feedbackPrompt);
      setGeneratedPages(pages);
      setAllGeneratedPages(prevPages => [...prevPages, ...pages]);
      setIterationCount((prevCount) => prevCount + 1);
      showNotification('Landing pages generated successfully', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to generate landing pages. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = (feedback) => {
    if (iterationCount >= 5) {
      showNotification('Maximum iterations reached. Please start a new session.', 'warning');
    } else {
      handleGenerate(feedback);
    }
  };

  const handleCopySuccess = () => {
    showNotification('HTML copied to clipboard', 'success');
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', mt: 4, p: 3 }}>
            <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Landing Page Generator
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <TextField
          fullWidth
          label="Enter your landing page idea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <Button
          variant="contained"
          onClick={() => handleGenerate()}
          disabled={isLoading || !prompt}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Generate Pages'}
        </Button>
      </motion.div>
      <AnimatePresence>
        {generatedPages.length > 0 && (
          <motion.div
            key="generated-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={showComparison}
                  onChange={(e) => setShowComparison(e.target.checked)}
                />
              }
              label="Show Comparison View"
            />
            {showComparison ? (
              <ComparisonView pages={allGeneratedPages} />
            ) : (
              <>
                <PagePreview pages={generatedPages} onCopySuccess={handleCopySuccess} />
                <FeedbackForm onSubmit={handleFeedbackSubmit} iterationCount={iterationCount} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </Box>
  );
};

export default LandingPageGenerator;
