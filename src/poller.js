var _ = require('underscore');
var Promise = require('bluebird');
var config = require('../config');
var bus = require('./bus');
var needle = Promise.promisifyAll(require('needle'));

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
	// Fetches a list of followers and pushes a message on the bus for each new follower in the list.
	follows: (data) => {
		return needle.getAsync(baseUrl + '/channels/' + config.channel + '/follows?limit=100&cursor=' + (Date.now() * 1000000), defaultOptions)
			.then(response => {
				return _.map(response.body.follows, (follower) => {
					return follower.user.name;
				});
			})
			.then(followerMap => {
				// Handle data population after polling for the first time.
				if (!data.state) {
					data.state = followerMap;
					return;
				}

				// We'd normally solve this by using _.difference, but since a user can have many followers (>100) we need to handle this scenario:
				// We have a list of 100 latest followers. One of these unfollow and we fetch the top 100 once more. Now a new name has shown up at the end of the list.
				// We should ignore new names at the end of the list since these aren't really new. We only care about new names at the start of the list. These are actual new
				// followers.
				var jointIndex = 0,
					firstInState = _.first(data.state); // Get first name in existing list
				if (firstInState !== _.first(followerMap)) { //Check if first name in existing list is the same as first name in the fetched list.
					// Find and return the index of the fetched list at which the name equals the first name in the existing list.
					jointIndex = _.findIndex(followerMap, (element) => {
						return element === firstInState;
					});
				}

				// Update state
				data.state = followerMap;

				// Return the difference of the existing and fetched follower lists. If the lists had the same first name, jointIndex will be 0 and _.first will return
				// an empty list;
				return _.first(followerMap, jointIndex);
			})
			.then(newFollowers => {
				if (newFollowers && newFollowers.length > 0) {
					return Promise.each(newFollowers, follower => {
						bus.publish({
							type: 'follow',
							title: 'New Follower:',
							message: follower
						});
					});
				}
			});
	},

	// Fetch a list of visible viewers of your stream and pushes a message on the bus for each new and lost viewer.
	// Moderators and admin are in a separate list and will not be taken into account as viewers.
	viewers: (data) => {
		return needle.getAsync('http://tmi.twitch.tv/group/user/' + config.channel + '/chatters')
			.then(response => {
				// Init state if polling for the first time
				if (!data.state) {
					data.state = [];
				}

				var viewerLists = {
					newViewers: _.difference(response.body.chatters.viewers, data.state),
					lostViewers: _.difference(data.state, response.body.chatters.viewers)
				};

				// Update state
				data.state = response.body.chatters.viewers;

				return viewerLists;
			})
			.then(viewerLists => {
				_.each(viewerLists.newViewers, (newViewer) => {
					bus.publish({
						type: 'viewer',
						message: 'New viewer: ' + newViewer
					});
				});
				_.each(viewerLists.lostViewers, (lostViewer) => {
					bus.publish({
						type: 'viewer',
						message: 'Lost viewer: ' + lostViewer
					});
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

//Start poller which runs every 10th second
module.exports.start = () => {
	setInterval(() => {
		var time = Date.now();

		Promise.each(polls, poll => {
			if (!poll.lastRuntime || poll.lastRuntime + (poll.interval * 1000) <= time) {
				poll.lastRuntime = time;
				return handlers[poll.name](poll);
			}
		}).catch(error => {
			console.log('Poller error:', error);
		});
	}, 10 * 1000);
};
