const router = require('express').Router();
const { getCallById } = require('../services/storageService');
const { answerFromTranscript } = require('../services/transcriptQaService');

router.post('/', async (req, res) => {
  const { callId, question } = req.body || {};
  if (!callId) return res.status(400).json({ error: 'callId required' });
  if (!question || !String(question).trim()) return res.status(400).json({ error: 'question required' });

  const call = getCallById(callId);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  if (!call.transcript) return res.status(400).json({ error: 'No transcript for this call' });

  try {
    const answer = await answerFromTranscript(call.transcript, question);
    res.json({ answer, question: String(question).trim() });
  } catch (e) {
    console.error('Transcript Q&A error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
