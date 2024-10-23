const express = require('express');
const { generateContent, saveContent, getSavedContents, updateContent, deleteContent, generateLandingPages } = require('../controllers/contentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/generate', authMiddleware, generateContent);
router.post('/save', (req, res, next) => {
  next();
}, authMiddleware, saveContent);
router.get('/', authMiddleware, getSavedContents);
router.put('/:id', authMiddleware, updateContent);
router.delete('/:id', authMiddleware, deleteContent);
router.post('/generate-landing-pages', authMiddleware, generateLandingPages); //pages


module.exports = router;