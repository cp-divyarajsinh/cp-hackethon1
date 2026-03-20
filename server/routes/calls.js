const router = require('express').Router();
const { getAllCalls, getCallById } = require('../services/storageService');

router.get('/', (req, res) => {
  try {
    res.json(getAllCalls());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', (req, res) => {
  const call = getCallById(req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  res.json(call);
});

module.exports = router;
