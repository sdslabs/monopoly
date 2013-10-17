//Load the Global Function Module
var global = require('./global.js');

// var events = require('events');

function send(req, res, file){
	res.sendfile(__dirname + '/public/' + file);
	global.log('info', 'Sent file: ' + file + ' to client: ' + req.connection.remoteAddress);
}

function initialize (app){

	app.use(function (req, res, next) {
		res.header('X-powered-by', 'PSWS');
  		next();
	});

	app.get('/', function (req, res) {
		res.render('index');
		global.log('info', 'Sent homepage to client: ' + req.connection.remoteAddress);
	});

	app.get('/:folder/:file', function(req, res){
		send(req, res, req.params.folder+'/'+req.params.file);
	});

	app.get('*', function(req, res){
		require('fs').readFile(
			__dirname + '/public/' + '404.html',
			{encoding: 'utf8'},
			function (err, data){
				if(err)
					throw err;
				res.send(data, 404);
		});
	});
}

module.exports.initialize = initialize;