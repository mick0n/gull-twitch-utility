var config = require('../config');
var bus = require('./bus');
var needle = require('needle');
var express = require('express');
var nodeNotify = require('node-notifier');
require('./socketlistener');
require('ejs');
var poller = require('./poller');
var irc = require('./irc');

var app = new express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/pub', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('index', {reso: config.resolution});
});

var server = app.listen(config.port, () => {
	console.log('Server started on port ' + server.address().port);
	poller.start();
	// irc.start();
});

var _ = require('underscore');
var oldArray = ['value', 'of', 'three'];
var newArray = ['value', 'three'];
console.log('Diff:', _.difference(oldArray, newArray)); //Removed viewers
console.log('Diff reverse:', _.difference(newArray, oldArray)); //Added viewers
