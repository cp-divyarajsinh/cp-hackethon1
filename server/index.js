const path = require('path');
const fs = require('fs');
// When `npm run dev:server` runs as `cd server && nodemon`, cwd is server/ — load repo root .env first.
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { seedDataIfEmpty } = require('./services/storageService');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const { requireAuth } = require('./middleware/auth');

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));

app.use('/audio', express.static(uploadsDir));

app.use('/api/auth', require('./routes/auth'));

app.use('/api/calls', requireAuth, require('./routes/calls'));
app.use('/api/upload', requireAuth, require('./routes/upload'));
app.use('/api/transcribe', requireAuth, require('./routes/transcribe'));
app.use('/api/analyze', requireAuth, require('./routes/analyze'));
app.use('/api/ask', requireAuth, require('./routes/ask'));
app.use('/api/ask-playbook', requireAuth, require('./routes/askPlaybook'));
app.use('/api/question-library', requireAuth, require('./routes/questions'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await seedDataIfEmpty();
  console.log(`Server running on port ${PORT}`);
});
