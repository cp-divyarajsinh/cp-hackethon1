const router = require('express').Router();
const { transcribeAudio } = require('../services/whisperService');

router.post('/', async (req, res) => {
  const { id, filePath } = req.body;
  if (!filePath) return res.status(400).json({ error: 'filePath required' });
  try {
    const transcript = await transcribeAudio(filePath);
    res.json({ id, transcript });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
