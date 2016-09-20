var WebSocket = require('ws');
var WebSocketServer = require('ws').Server;

module.exports = function SocketListener(options) {
	// At this point we do not use any "default" values, either they are configured in config.js or
	// this will come to a quick stop right here.
	if (!options) {
		throw new Error('Expected options but got none');
	}

	var self = this;
	var serverSocket = new WebSocketServer({port: options.port});

	// Since Gull - Twitch utility is design to be used by a single person we only have one socket open (per port)
	// at any given time.
	var clientSocket;

	serverSocket.on('connection', (socket) => {
		if (clientSocket) {
			console.log('Websocket port ' + options.port + ' already has connection, dumping it');
			clientSocket.close();
		}
		clientSocket = socket;
		clientSocket.on('message', (messageData) => {
			if(options.messageHandler) {
				options.messageHandler.call(self, JSON.parse(messageData));
			}
		});
		clientSocket.on('close', () => {
			clientSocket = null;
		});
	});

	// Send message to connected client (if any). Takes care of stringification of JavaScript Object.
	function send(data) {
		if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
			clientSocket.send(JSON.stringify(data));
		}
	}

	return {
		send: send
	};
};
