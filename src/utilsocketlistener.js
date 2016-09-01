var config = require('../config');
var bus = require('./bus');
var SocketListener = require('./socketlistener');

var socketListener = new SocketListener({port: config.utilport});

bus.subscribe((messageData) => {
	socketListener.send(messageData);
});
