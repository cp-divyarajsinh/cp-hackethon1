const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_EXT = new Set(['.mp3', '.mp4', '.wav', '.m4a', '.webm', '.ogg']);
const MIME_EXT = {
  'audio/webm': '.webm',
  'video/webm': '.webm',
  'audio/mp4': '.m4a',
  'video/mp4': '.m4a',
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/wave': '.wav',
  'audio/ogg': '.ogg',
  'application/ogg': '.ogg',
};

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname || '').toLowerCase();
    if (!ext || !ALLOWED_EXT.has(ext)) {
      const fromMime = MIME_EXT[(file.mimetype || '').toLowerCase()];
      ext = fromMime || '.webm';
    }
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (ALLOWED_EXT.has(ext)) return cb(null, true);
    const fromMime = MIME_EXT[(file.mimetype || '').toLowerCase()];
    if (fromMime) return cb(null, true);
    cb(null, false);
  },
});

router.post('/', upload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio file provided' });
  res.json({
    id: path.parse(req.file.filename).name,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    filePath: req.file.path,
    size: req.file.size,
  });
});

module.exports = router;
