var config = require('../config');
var bus = require('./bus');
var needle = require('needle');
var nodeNotify = require('node-notifier');

const baseUrl = 'https://api.twitch.tv/kraken';

const headers = {
	'Content-Type': 'application/json',
	'Client-ID': config.clientId
};

const defaultOptions = {
	compressed: true,
	rejectUnauthorized: true,
	headers: headers
};

var handlers = {
	follows: () => {
		return new Promise((resolve, reject) => {
			needle.get(baseUrl + '/channels/' + config.channel + '/follows?limit=1', defaultOptions, (error, response) => {
				if (error) {
					return reject(error);
				}
				console.log(response.body);
				console.log(response.body.follows[0].user);
				bus.publish({
					type: 'follow',
					title: 'New Follower:',
					message: response.body.follows[0].user.name
				});
				resolve(response.body);
			});
		});
	}
};

var polls = [
	{
		name: 'follows',
		interval: 30, //In seconds
		lastRuntime: null,
		state: null
	}
];

module.exports.start = () => {
	setInterval(() => {
		var time = Date.now();
		var promiseList = [];
		for(var a = 0; a < polls.length; a++) {
			if (!polls[a].lastRuntime || polls[a].lastRuntime + (polls[a].interval * 1000) <= time) {
				console.log('Time to run ' + polls[a].name);
				promiseList.push(handlers[polls[a].name]());
				polls[a].lastRuntime = time;
			}
		}
		Promise.all(promiseList)
			.then(() => {
				console.log('Cool all went well');
			})
			.catch((error) => {
				console.log('Shit hit the fan', error);
			});
	}, 30 * 1000);
};
