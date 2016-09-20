var config = require('../config');
var bus = require('./bus');
var SocketListener = require('./socketlistener');

var socketListener = new SocketListener({port: config.streamport});

bus.subscribe((messageData) => {
	if(messageData.type === 'viewer') {
		//This event is only for the util-view. May be more convenient to have a blacklist array in the future.
		//Depends on how many events there'll be.
		return;
	}
	socketListener.send(messageData);
});
