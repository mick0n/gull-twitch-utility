var config = require('../config');
var bus = require('./bus');
var WebSocket = require('ws');
var WebSocketServer = require('ws').Server;

var serverSocket = new WebSocketServer({port: config.websocketPort});

var clientSocket;

serverSocket.on('connection', (socket) => {
	if (clientSocket) {
		console.log('Already has connection, dumping it');
		clientSocket.close();
	}
	clientSocket = socket;
	clientSocket.on('message', (messageData) => {
		console.log(messageData);
	});
	console.log('client connected');
	sendDataToClient({
		type: 'greet',
		title: 'New message',
		message: 'sum message'
	});
});

bus.subscribe((messageData) => {
	sendDataToClient(messageData);
});

function sendDataToClient(data) {
	if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
		console.log(data);
		clientSocket.send(JSON.stringify(data));
	}
}