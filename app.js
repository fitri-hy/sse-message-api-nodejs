const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let channels = {};

app.post('/send-message', (req, res) => {
  const { sender, message, imageBase64, audioBase64, id_channel } = req.body;

  if (!id_channel || (!message && !imageBase64 && !audioBase64)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const date = new Date().toISOString();

  if (!channels[id_channel]) {
    channels[id_channel] = [];
  }

  const data = {
    sender,
    message,
    date,
    image: imageBase64 || null,
    audio: audioBase64 || null,
  };

  channels[id_channel].forEach((client) => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  res.status(200).json({ message: 'Message sent' });
});

app.get('/subscribe/:channel', (req, res) => {
  const { channel } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!channels[channel]) {
    channels[channel] = [];
  }

  const client = {
    id: Date.now(),
    res,
  };

  channels[channel].push(client);

  req.on('close', () => {
    channels[channel] = channels[channel].filter((c) => c.id !== client.id);
  });
});

app.listen(3000, () => {
  console.log('SSE server running on port 3000');
});
