const express = require('express');
const cors = require('cors');
const path = require('path');
const validator = require('validator');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let clients = {};

app.get('/events/:channel', (req, res) => {
    const channel = req.params.channel;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!clients[channel]) {
        clients[channel] = [];
    }
    clients[channel].push(res);

    req.on('close', () => {
        clients[channel] = clients[channel].filter(client => client !== res);
    });
});

app.post('/send/:channel', (req, res) => {
    const channel = req.params.channel;
    let { sender, message } = req.body;

    sender = validator.trim(sender);
    message = validator.trim(message);

    if (message.length === 0 || message.length > 200) {
        return res.status(400).json({ error: 'Message must be between 1 and 200 characters.' });
    }

    message = validator.escape(message);
    sender = validator.escape(sender);

    if (clients[channel]) {
        clients[channel].forEach(client => {
            client.write(`data: ${JSON.stringify({ sender, message })}\n\n`);
        });
    }

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
