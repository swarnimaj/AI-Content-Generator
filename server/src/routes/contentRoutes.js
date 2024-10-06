const express = require('express');
const { generateContent, saveContent, getSavedContents, updateContent, deleteContent } = require('../controllers/contentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Add this log
console.log('Setting up content routes');

router.post('/generate', authMiddleware, generateContent);
router.post('/save', (req, res, next) => {
  console.log('Save route accessed');
  next();
}, authMiddleware, saveContent);
router.get('/', authMiddleware, getSavedContents);
router.put('/:id', authMiddleware, updateContent);
router.delete('/:id', authMiddleware, deleteContent);

module.exports = router;