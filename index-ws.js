const express = require('express');

const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: __dirname
    });
}
);

server.on('request', app);
server.listen(3000, () => {
    console.log('Server started on port 3000 !!');
});

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('Client connected');
    const numClient = wss.clients.size;
    console.log(`Number of clients connected: ${numClient}`);
    wss.broadcast(`Number of clients connected: ${numClient}`);

    ws.readyState === ws.OPEN
        ? ws.send('Welcome to the WebSocket server!')
        : console.log('WebSocket is not open');
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        ws.send(`Server received: ${message}`);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocketServer.OPEN) {
            client.send(data);
        }
    });
}