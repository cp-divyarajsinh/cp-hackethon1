const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { analyzeTranscript } = require('../services/openaiAnalysisService');
const { saveCall } = require('../services/storageService');

router.post('/', async (req, res) => {
  const { id, fileName, originalName, transcript, duration } = req.body;
  if (!transcript) return res.status(400).json({ error: 'transcript required' });

  try {
    const analysis = await analyzeTranscript(transcript);
    const callData = {
      id: id || uuidv4(),
      fileName: fileName || originalName || 'unknown.wav',
      uploadedAt: new Date().toISOString(),
      duration: duration || 0,
      status: 'ready',
      transcript,
      ...analysis,
    };
    saveCall(callData);
    res.json(callData);
  } catch (e) {
    console.error('Analysis error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
