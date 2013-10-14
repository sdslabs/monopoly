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
		res.sendfile(__dirname + '/public/scripts/jquery.js');
		global.log('info', 'Sent file: /public/scripts/jquery.js to client: ' + req.connection.remoteAddress);
	});

	app.get('/scripts/init.js', function(req, res){
		res.sendfile(__dirname + '/public/scripts/init.js');
		global.log('info', 'Sent file: /public/scripts/init.js to client: ' + req.connection.remoteAddress);
	});

	app.get('/scripts/bootstrap/bootstrap.min.js', function(req, res){
		res.sendfile(__dirname + '/public/scripts/bootstrap/bootstrap.min.js');
		global.log('info', 'Sent file: /public/scripts/bootstrap/bootstrap.min.js to client: ' + req.connection.remoteAddress);
	});

	app.get('/icons/lightbulb_icon48.png', function(req, res){
		res.sendfile(__dirname + '/public/icons/lightbulb_icon48.png');
		global.log('info', 'Sent file: /public/icons/lightbulb_icon48.png to client: ' + req.connection.remoteAddress);
	});

	app.get('/css/custom.css', function(req, res){
		res.sendfile(__dirname + '/public/css/custom.css');
		global.log('info', 'Sent file: /public/css/custom.css to client: ' + req.connection.remoteAddress);
	});

	app.get('/css/bootstrap/bootstrap.min.css', function(req, res){
		res.sendfile(__dirname + '/public/css/bootstrap/bootstrap.min.css');
		global.log('info', 'Sent file: /public/css/bootstrap/bootstrap.min.css to client: ' + req.connection.remoteAddress);
	});

	app.get('/images/main-bg.jpg', function(req, res){
		res.sendfile(__dirname + '/public//images/main-bg.jpg');
		global.log('info', 'Sent file: /public//images/main-bg.jpg to client: ' + req.connection.remoteAddress);
	});



}

module.exports.initialize = initialize;