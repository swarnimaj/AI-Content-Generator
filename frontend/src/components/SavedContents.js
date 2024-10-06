import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography, 
  TextField, 
  Button, 
  Box 
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { getSavedContents, deleteContent, updateContent } from '../services/api';

const SavedContents = () => {
  const [contents, setContents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const fetchedContents = await getSavedContents();
      setContents(fetchedContents);
    } catch (error) {
      console.error('Error fetching contents:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContent(id);
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleEdit = (content) => {
    setEditingId(content._id);
    setEditedContent(content.content);
  };

  const handleSave = async () => {
    try {
      await updateContent(editingId, editedContent);
      setEditingId(null);
      fetchContents();
    } catch (error) {
      console.error('Error updating content:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedContent('');
  };

  return (
    <div>
      <Typography variant="h6">Saved Contents</Typography>
      <List>
        {contents.map((content) => (
          <ListItem key={content._id} alignItems="flex-start">
            {editingId === content._id ? (
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button startIcon={<SaveIcon />} onClick={handleSave} variant="contained" sx={{ mr: 1 }}>
                  Save
                </Button>
                <Button startIcon={<CancelIcon />} onClick={handleCancel} variant="outlined">
                  Cancel
                </Button>
              </Box>
            ) : (
              <>
                <ListItemText 
                  primary={content.type === 'article' ? 'Article' : 'Landing Page'}
                  secondary={content.content.substring(0, 100) + '...'}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(content)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(content._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SavedContents;