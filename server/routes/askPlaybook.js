const router = require('express').Router();
const { getCallById } = require('../services/storageService');
const { answerPlaybookFromTranscript } = require('../services/transcriptQaService');

router.post('/', async (req, res) => {
  const { callId } = req.body || {};
  if (!callId) return res.status(400).json({ error: 'callId required' });

  const call = getCallById(callId);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  if (!call.transcript) return res.status(400).json({ error: 'No transcript for this call' });

  try {
    const results = await answerPlaybookFromTranscript(call.transcript);
    res.json({ results });
  } catch (e) {
    console.error('Playbook transcript Q&A error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
