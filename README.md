# Real-Time SSE Messaging API with Multi-Channel

A real-time SSE messaging API with multi-channel support.

## Featured:

- Api Realtime Message
- Server Monitoring (All Message)
- Multi Channels

## Installation

```
git clone https://github.com/fitri-hy/sse-message-api-nodejs.git
cd sse-message-api-nodejs
npm Install
npm start
open localhost:3000
```


## API Usage

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSE Multi-Channel Example</title>
</head>
<body>
    <h1>SSE Multi-Channel Example</h1>
    <div id="messages"></div>

    <form id="messageForm">
        <input type="text" id="nameInput" placeholder="Your name (optional)" />
        <input type="text" id="messageInput" placeholder="Type your message here" required />
        <button type="submit">Send</button>
    </form>

    <script>
        const channel = 'channel1';
        const eventSource = new EventSource(`http://localhost:3000/events/${channel}`);

        eventSource.onmessage = ({ data }) => {
            const { sender, message } = JSON.parse(data);
            document.getElementById('messages').innerHTML += `
                <div>
                    <img src="http://localhost:3000/avatar.png" height="80" width="80">
                    <p>${sender || 'Guest'}</p>
                    <p>${message}</p>
                </div>
            `;
        };

        document.getElementById('messageForm').onsubmit = (e) => {
            e.preventDefault();
            const sender = document.getElementById('nameInput').value.trim() || 'Guest';
            const message = document.getElementById('messageInput').value;

            fetch(`http://localhost:3000/send/${channel}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender, message }),
            });

            document.getElementById('messageInput').value = '';
            document.getElementById('nameInput').value = '';
        };
    </script>
</body>
</html>
```