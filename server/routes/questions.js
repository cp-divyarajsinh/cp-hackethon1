const fs = require('fs');
const path = require('path');

const router = require('express').Router();

router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(path.join(__dirname, '../questions.json'), 'utf-8');
    res.json(JSON.parse(raw));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
