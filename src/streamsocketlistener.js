var config = require('../config');
var bus = require('./bus');
var SocketListener = require('./socketlistener');

var socketListener = new SocketListener({port: config.streamport});

bus.subscribe((messageData) => {
	if(messageData.type !== 'viewer') {
		socketListener.send(messageData);
	}
});
