//Load the Global Function Module
var global = require('./global.js');

// var events = require('events');

function initialize (app){
	app.get('/', function (req, res) {
		// res.sendfile(__dirname + '/public/index.html');
		res.render('index');
		global.log('info', 'Sent file: /public/index.html to client: ' + req.connection.remoteAddress);
	});

	app.get('/rootCA', function(req, res){
		res.setHeader('Content-Type', 'application/x-pem-file');
		res.sendfile(__dirname + '/ssl/root/rootCA.pem');
		global.log('info', 'Sent X.509 root CA certificate: to client: ' + req.connection.remoteAddress);
	});

	app.get('/scripts/jquery.js', function(req, res){
		res.sendfile(__dirname + '/public/Scripts/jquery.js');
		global.log('info', 'Sent file: /public/Scripts/jquery.js to client: ' + req.connection.remoteAddress);
	});

	app.get('/scripts/init.js', function(req, res){
		res.sendfile(__dirname + '/public/Scripts/init.js');
		global.log('info', 'Sent file: /public/Scripts/init.js to client: ' + req.connection.remoteAddress);
	});

	app.get('/icons/lightbulb_icon48.png', function(req, res){
		res.sendfile(__dirname + '/public/icons/lightbulb_icon48.png');
		global.log('info', 'Sent file: /public/icons/lightbulb_icon48.png to client: ' + req.connection.remoteAddress);
	});

	app.get('/css/custom.css', function(req, res){
		res.sendfile(__dirname + '/public/css/custom.css');
		global.log('info', 'Sent file: /public/css/custom.css to client: ' + req.connection.remoteAddress);
	});
}

module.exports.initialize = initialize;