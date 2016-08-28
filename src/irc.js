var config = require('../config');
var bus = require('./bus');
var Client = require('irc').Client;
var nodeNotify = require('node-notifier');


module.exports.start = () => {
	console.log('lets do this');
	var client = new Client('irc.chat.twitch.tv', config.irc.nickname, {
		password: config.irc.oauthToken,
		channels: [
			'#' + config.channel
		]
	});

	client.addListener('message', (from, to, message) => {
		console.log(from);
		console.log(to);
		console.log(message);
	});

	client.addListener('join', (channel, nickname) => {
		if (nickname.toLowerCase() !== config.irc.nickname.toLowerCase() && nickname.toLowerCase() !== config.channel) {
			nodeNotify.notify({
				title: 'Gull - Twitch Utility',
				message: 'User ' + nickname + ' connected',
				icon: __dirname + '/public/gull_64.png',
				sound: false
			});
			client.say(channel, 'Welcome ' + nickname + '! ');
		}
	});

	client.addListener('error', (error) => {
		console.log('Got error', error, error.stack);
	});
};
