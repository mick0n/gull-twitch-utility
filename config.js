module.exports = {
	port: 8000,
	streamport: 8001,
	utilport: 8002,
	clientId: 'your-client-id-here',
	resolution: {
		width: 1280,
		height: 720
	},
	channel: 'mick0n_2',
	irc: { //Twitch irc should use a secondary account for the bot, i.e. the nickname and token will be that of the bot account, not your streamer account
		nickname: 'gull_twitch_utility_bot',
		oauthToken: 'your-oauth-token-here'
	}
};
