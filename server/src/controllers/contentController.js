const Content = require('../models/Content');
const axios = require('axios');

exports.generateContent = async (req, res) => {
  try {
    const { topic, type } = req.body;
    
    let prompt;
    if (type === 'article') {
      prompt = `Write an article about ${topic}`;
    } else if (type === 'landingPage') {
      prompt = `Create HTML for a landing page about ${topic}`;
    } else {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt,
      max_tokens: 500,
      n: 1,
      stop: null,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const generatedContent = response.data.choices[0].text.trim();

    const newContent = new Content({
      type,
      content: generatedContent,
      userId: req.userId,
    });

    await newContent.save();

    res.json({ content: generatedContent, contentId: newContent._id });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ message: 'Failed to generate content' });
  }
};

exports.saveContent = async (req, res) => {
  console.log('saveContent function called');
  try {
    const { content, type } = req.body;
    const userId = req.userId;

    console.log('Received content:', content);
    console.log('Received type:', type);
    console.log('User ID:', userId);

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    const newContent = new Content({
      content,
      type,
      userId,
    });

    const savedContent = await newContent.save();
    console.log('Saved content:', savedContent);

    res.status(201).json({ message: 'Content saved successfully', contentId: savedContent._id });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ message: 'Failed to save content', error: error.message });
  }
};

exports.getSavedContents = async (req, res) => {
  try {
    const contents = await Content.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(contents);
  } catch (error) {
    console.error('Error fetching saved contents:', error);
    res.status(500).json({ message: 'Failed to fetch saved contents' });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedContent = await Content.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { content },
      { new: true }
    );
    if (!updatedContent) {
      return res.status(404).json({ message: 'Content not found or you do not have permission to update it' });
    }
    res.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Failed to update content' });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContent = await Content.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deletedContent) {
      return res.status(404).json({ message: 'Content not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Failed to delete content' });
  }
};