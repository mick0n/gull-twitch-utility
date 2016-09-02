var _ = require('underscore');
var config = require('../config');
var bus = require('./bus');
var needle = require('needle');

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
	follows: (data) => {
		return new Promise((resolve, reject) => {
			needle.get(baseUrl + '/channels/' + config.channel + '/follows?limit=100&cursor=' + (Date.now() * 1000000), defaultOptions, (error, response) => {
				if (error) {
					return reject(error);
				}

				var followerMap = _.map(response.body.follows, (follower) => {
					return follower.user.name;
				});
				if (!data.state) {
					data.state = followerMap;
					return resolve();
				}

				var jointIndex = 0,
					firstInState = _.first(data.state);
				if (firstInState !== _.first(followerMap)) { //Is the head of each list equal? If not, we have a new follower
					jointIndex = _.findIndex(followerMap, (element) => { //At which index does the head of the current state exist? Compared to next state
						return element === firstInState;
					});
				}
				var newFollowers = _.first(followerMap, jointIndex);
				console.log(newFollowers);

				data.state = followerMap;
				if (newFollowers.length > 0) {
					_.each(newFollowers, (follower) => {
						bus.publish({
							type: 'notification',
							title: 'New Follower:',
							message: follower
						});
					});
				}
				resolve();
			});
		});
	},
	viewers: (data) => {
		return new Promise((resolve, reject) => {
			needle.get('http://tmi.twitch.tv/group/user/mick0n_2/chatters', (error, response) => {
				if (error) {
					return reject(error);
				}
				if (!data.state) {
					data.state = [];
				}
				console.log(response.body.chatters);
				var newViewers = _.difference(response.body.chatters.viewers, data.state);
				var lostViewers = _.difference(data.state, response.body.chatters.viewers);
				if (newViewers.length > 0) {
					console.log('Viewers', newViewers);
				}
				if (lostViewers.length > 0) {
					console.log('Lost viewers', lostViewers);
				}
				_.each(newViewers, (newViewer) => {
					bus.publish({
						type: 'viewer',
						message: 'New viewer: ' + newViewer
					});
				});
				_.each(lostViewers, (lostViewer) => {
					bus.publish({
						type: 'viewer',
						message: 'Lost viewer: ' + lostViewer
					});
				});
				data.state = response.body.chatters.viewers;
				resolve();
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
	},
	{
		name: 'viewers',
		interval: 30,
		lastRuntime: null,
		state: null
	}
];

module.exports.start = () => {
	setInterval(() => {
		var time = Date.now();
		var promiseList = [];
		_.each(polls, (poll) => {
			if (!poll.lastRuntime || poll.lastRuntime + (poll.interval * 1000) <= time) {
				promiseList.push(handlers[poll.name].call(null, poll));
				poll.lastRuntime = time;
			}
		});
		Promise.all(promiseList)
			.then(() => {
				console.log('Cool all went well');
				bus.publish({
					type: 'notification',
					title: 'Event:',
					message: 'Hey there :)'
				});
			})
			.catch((error) => {
				console.log('Shit hit the fan', error);
			});
	}, 10 * 1000);
};
