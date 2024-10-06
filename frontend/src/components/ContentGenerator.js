// src/components/ContentGenerator.js
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  Tabs,
  Tab,
  Fade,
  CircularProgress,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, GetApp as DownloadIcon, Save as SaveIcon } from '@mui/icons-material';
import { generateContent, getSavedContents, deleteContent, updateContent, saveContent } from '../services/api';

const ContentGenerator = () => {
    const [topic, setTopic] = useState('');
    const [editingContent, setEditingContent] = useState('');
    const [savedContents, setSavedContents] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [error, setError] = useState(null);
  
    const fetchSavedContents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const contents = await getSavedContents();
        setSavedContents(contents);
      } catch (error) {
        console.error('Error fetching saved contents:', error);
        setError('Failed to fetch saved contents. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
      if (newValue === 1) { // Assuming 1 is the index for "Saved Contents" tab
        fetchSavedContents();
      }
    };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const content = await generateContent(topic);
      setEditingContent(content);
      setEditingId(null);
      showSnackbar('Content generated successfully', 'success');
    } catch (error) {
      console.error('Error generating content:', error);
      showSnackbar('Failed to generate content', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let result;
      if (editingId) {
        result = await updateContent(editingId, editingContent);
      } else {
        console.log('Saving new content');
        // Assuming 'article' as the default type, you might want to make this dynamic
        result = await saveContent(editingContent, 'article');
      }
      console.log('Save result:', result);
      setEditingId(null);
      setEditingContent('');
      setTopic('');
      fetchSavedContents();
      showSnackbar(editingId ? 'Content updated successfully' : 'Content saved successfully', 'success');
    } catch (error) {
      console.error('Error saving content:', error.response ? error.response.data : error.message);
      showSnackbar(`Failed to save content: ${error.response ? error.response.data.message : error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content.content);
    setEditingId(content._id);
    setActiveTab(0); // Switch to the Generate/Edit tab
  };

  const handleDelete = async (id) => {
    try {
      await deleteContent(id);
      fetchSavedContents();
      showSnackbar('Content deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting content:', error);
      showSnackbar('Failed to delete content', 'error');
    }
  };

  const handleDownload = (content) => {
    const element = document.createElement("a");
    const file = new Blob([content.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "generated-content.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showSnackbar('Content downloaded successfully', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      margin: 'auto', 
      mt: 4, 
      p: 3,
      backgroundColor: '#0F172A',
      minHeight: '100vh',
      color: 'white'
    }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', textAlign: 'center', mb: 4 }}>
        AI Content Generator
      </Typography>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        centered
        sx={{ 
          mb: 4,
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
          },
          '& .MuiTab-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        <Tab label="Generate & Edit" />
        <Tab label="Saved Contents" />
      </Tabs>

      <Fade in={activeTab === 0}>
        <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: 'rgba(255,255,255,0.05)', display: activeTab === 0 ? 'block' : 'none' }}>
          <Typography variant="h6" gutterBottom>Generate New Content</Typography>
          <TextField
            fullWidth
            label="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{ 
              input: { color: 'white' },
              label: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleGenerate}
            disabled={isLoading || !topic}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Generating...' : 'Generate Content'}
          </Button>

          <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.1)' }} />

          <Typography variant="h6" gutterBottom>
            {editingId ? 'Edit Content' : 'Generated Content'}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{ 
              textarea: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={isLoading || !editingContent}
            startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ mt: 2, mr: 2 }}
          >
            {isLoading ? 'Saving...' : (editingId ? 'Update Content' : 'Save Content')}
          </Button>
          {editingId && (
            <Button 
              variant="outlined" 
              onClick={() => {
                setEditingId(null);
                setEditingContent('');
                setTopic('');
              }}
              sx={{ mt: 2 }}
            >
              Cancel Edit
            </Button>
          )}
        </Paper>
      </Fade>

      <Fade in={activeTab === 1}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255,255,255,0.05)', display: activeTab === 1 ? 'block' : 'none' }}>
          <Typography variant="h6" gutterBottom>Saved Contents</Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          ) : savedContents.length === 0 ? (
            <Typography sx={{ mt: 2 }}>No saved contents yet.</Typography>
          ) : (
            <List>
              {savedContents.map((content) => (
              <ListItem key={content._id} sx={{ 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}>
                <ListItemText 
                  primary={content.content.substring(0, 50) + '...'}
                  sx={{ color: 'white' }}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(content)} sx={{ color: 'primary.main' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(content._id)} sx={{ color: 'error.main' }}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="download" onClick={() => handleDownload(content)} sx={{ color: 'success.main' }}>
                    <DownloadIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          )}
        </Paper>
      </Fade>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContentGenerator;