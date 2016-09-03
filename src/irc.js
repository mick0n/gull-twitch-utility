var config = require('../config');
var bus = require('./bus');
var Client = require('irc').Client;


module.exports.start = () => {
	console.log('lets do this');
	var client = new Client('irc.chat.twitch.tv', config.irc.nickname, {
		password: config.irc.oauthToken,
		channels: [
			'#' + config.channel
		]
	});

	client.addListener('message', (from, to, message) => {
		bus.publish({
			type: 'chat',
			from: from,
			message: message
		});
	});

	client.addListener('error', (error) => {
		console.log('Got error', error, error.stack);
	});
};
