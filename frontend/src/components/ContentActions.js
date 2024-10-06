import React from 'react';
import { useSelector } from 'react-redux';

const ContentActions = () => {
  const generatedContent = useSelector(state => state.content.generatedContent);

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'generated-content.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
      .then(() => alert('Content copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div>
      <h2>Content Actions</h2>
      <button onClick={handleDownload}>Download as Text</button>
      <button onClick={handleCopy}>Copy to Clipboard</button>
    </div>
  );
};

export default ContentActions;