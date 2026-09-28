const hindsightService = require('../services/hindsightService');

const testRetain = async (req, res) => {
  try {
    const memory = req.body;
    if (!memory || Object.keys(memory).length === 0) {
      return res.status(400).json({ error: 'Memory content is required in body' });
    }
    const result = await hindsightService.retainMemory(memory);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error retaining memory:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const testRecall = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required in body' });
    }
    const results = await hindsightService.recallMemory(query);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error recalling memory:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = {
  testRetain,
  testRecall
};
