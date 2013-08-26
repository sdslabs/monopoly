//Load the Global Function Module
var global = require('./global.js');

function initialize (app){
	app.get('/', function (req, res) {
		res.sendfile(__dirname + '/public/index.html');
		global.log('info', 'Sent file: /public/index.html to client: ' + req.connection.remoteAddress);
	});

	app.get('/rootCA', function(req, res){
		res.setHeader('Content-Type', 'application/x-pem-file');
		res.sendfile(__dirname + '/ssl/root/rootCA.pem');
		global.log('info', 'Sent X.509 root CA certificate: to client: ' + req.connection.remoteAddress);
	})

	// app.get('/favicon.ico', function(req, res){
	// 	res.sendfile(__dirname + '/favicon.ico');
	// });
}

module.exports.initialize = initialize;