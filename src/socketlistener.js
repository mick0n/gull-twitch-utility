var WebSocket = require('ws');
var WebSocketServer = require('ws').Server;

module.exports = function SocketListener(options) {
	if (!options) {
		throw new Error('Expected options but got none');
	}

	var self = this;
	var serverSocket = new WebSocketServer({port: options.port});
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

	function send(data) {
		if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
			clientSocket.send(JSON.stringify(data));
		}
	}

	console.log('Serversocket opened on port ' + options.port);

	return {
		send: send
	};
};
