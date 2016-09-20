var config = require('../config');
var bus = require('./bus');
var Client = require('irc').Client;

// Start the IRC client
// This could very easily be rewritten into a chatbot. Right now it only listenes for message
// and pushes them to the client.
module.exports.start = () => {
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
		console.log('IRC error', error);
	});
};
