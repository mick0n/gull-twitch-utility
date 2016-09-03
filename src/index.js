var config = require('../config');
var express = require('express');
var poller = require('./poller');
var irc = require('./irc');
require('./streamsocketlistener');
require('./utilsocketlistener');
require('ejs');

var app = new express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/pub', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('index', config);
});

app.get('/util', (req, res) => {
	res.render('util', config);
});

var server = app.listen(config.port, () => {
	console.log('Server started on port ' + server.address().port);
	poller.start();
	irc.start();
});
