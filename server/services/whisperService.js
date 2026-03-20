const fs = require('fs');
const OpenAI = require('openai');

let client;
function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      'OPENAI_API_KEY is not set. Add it to the project root .env (or server/.env) and restart the server.'
    );
  }
  if (!client) client = new OpenAI({ apiKey: key });
  return client;
}

async function transcribeAudio(filePath) {
  const response = await getClient().audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(filePath),
    response_format: 'text',
  });
  return response;
}

module.exports = { transcribeAudio };
