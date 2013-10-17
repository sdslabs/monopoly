//Load the Global Function Module
var global = require('./global.js');

// var events = require('events');

function send(req, res, file){
	res.sendfile(__dirname + '/public/' + file);
	global.log('info', 'Sent file: ' + file + ' to client: ' + req.connection.remoteAddress);
}

function initialize (app){

	app.get('/', function (req, res) {
		res.render('index');
		global.log('info', 'Sent file: index.html to client: ' + req.connection.remoteAddress);
	});

	// app.get('/rootCA', function(req, res){
	// 	res.setHeader('Content-Type', 'application/x-pem-file');
	// 	res.sendfile(__dirname + '/ssl/root/rootCA.pem');
	// 	global.log('info', 'Sent X.509 root CA certificate: to client: ' + req.connection.remoteAddress);
	// });

	app.get('/:folder/:file', function(req, res){
		send(req, res, req.params.folder+'/'+req.params.file);
	});

	app.get('*', function(req, res){
  		res.send('what???', 404);
	});
}

module.exports.initialize = initialize;