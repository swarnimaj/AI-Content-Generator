import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGeneratedContent, setError } from '../redux/contentSlice';
import { saveContent } from '../services/api';

const ContentEditor = () => {
  const generatedContent = useSelector(state => state.content.generatedContent);
  const dispatch = useDispatch();
  const [editedContent, setEditedContent] = useState(generatedContent);

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleSave = async () => {
    try {
      dispatch(setGeneratedContent(editedContent));
      await saveContent(editedContent);
      alert('Content saved successfully!');
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <div>
      <h2>Edit Content</h2>
      <textarea
        value={editedContent}
        onChange={handleContentChange}
        rows={10}
        cols={50}
      />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default ContentEditor;