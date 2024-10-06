import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGeneratedContent, setLoading, setError } from '../redux/contentSlice';
import { generateContent } from '../services/api';

const TopicInput = () => {
  const [topic, setTopic] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const content = await generateContent(topic);
      dispatch(setGeneratedContent(content));
    } catch (err) {
      dispatch(setError(err.message || 'An error occurred while generating content'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <h2>Generate Content</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic or keywords"
          required
        />
        <button type="submit">Generate</button>
      </form>
    </div>
  );
};

export default TopicInput;