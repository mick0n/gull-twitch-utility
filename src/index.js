var config = require('../config');
var needle = require('needle');
var express = require('express');

const baseUrl = 'https://api.twitch.tv/kraken';

const headers = {
	'Content-Type': 'application/json'
};

const defaultOptions = {
	compressed: true,
	rejectUnauthorized: true,
	headers: headers
};

// needle.get(baseUrl, defaultOptions, (error, response) => {
// 	if (error) console.log(error);
// 	if (response.body) console.log(response.body);
// });

var app = new express();

app.get('/', (req, res) => {
	res.send('Hello World');
});

var server = app.listen(8000, () => {
	console.log('Server started on port 8000');
});