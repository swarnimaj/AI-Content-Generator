import React, { useState } from 'react';
import { Box, Paper, Typography, Tabs, Tab, IconButton } from '@mui/material';
import { ContentCopy, Download } from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import LazyIframe from './LazyIframe';

const PagePreview = ({ pages, onCopySuccess }) => {
    const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pages[activeTab].html);
    onCopySuccess();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([pages[activeTab].html], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `landing-page-${activeTab + 1}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        {pages.map((page, index) => (
          <Tab label={`Page ${index + 1}`} key={page.id} />
        ))}
      </Tabs>
      <Box sx={{ display: 'flex', mt: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            style={{ width: '50%', paddingRight: '16px' }}
          >
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Box
              sx={{
                border: '1px solid #ccc',
                height: '500px',
                overflow: 'auto',
              }}
            >
              <LazyIframe
                srcDoc={pages[activeTab].html}
                title={`Preview ${activeTab + 1}`}
              />
            </Box>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ width: '50%', paddingLeft: '16px' }}
          >
            <Typography variant="h6" gutterBottom>
              HTML Code
              <IconButton onClick={handleCopyCode} size="small" sx={{ ml: 1 }}>
                <ContentCopy />
              </IconButton>
              <IconButton onClick={handleDownload} size="small">
                <Download />
              </IconButton>
            </Typography>
            <SyntaxHighlighter
              language="html"
              style={vscDarkPlus}
              customStyle={{
                height: '500px',
                overflow: 'auto',
              }}
            >
              {pages[activeTab].html}
            </SyntaxHighlighter>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Paper>
  );
};

export default PagePreview;
