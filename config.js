module.exports = {
	port: 8000,
	streamport: 8001,
	utilport: 8002,

	//ClientID is obtained by registering an application on twitch.
	clientId: 'your-client-id-here',

	//Screen resolution of stream. (This should be the resolution used BEFORE downscaling occurs)
	resolution: {
		width: 1280,
		height: 720
	},

	//Your Twitch.tv channel name
	channel: 'your-twitch-channel-name',

	//Twitch irc should use a secondary account for the bot, i.e. the nickname and token will be that of the bot account, not your streamer account
	//It is still possible to use your regular account, but if the bot posts it will look like YOU posted the message.
	irc: {
		nickname: 'your-twitch-bot-account',
		oauthToken: 'your-oauth-token-here'
	}
};
