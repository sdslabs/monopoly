//Load the Global Function Module
var global = require('./global.js');
// var events = require('events');

var fs = require('fs');

function send(req, res, file){
	// res.sendfile(__dirname + '/public/' + file);
	path = __dirname + '/public/' + file;
	fs.exists(path, function (exists){
			if(!exists)
				send404(res);
			else{
				res.sendfile(path);
				global.log('verbose', 'Sent file: ' + file + ' to client: ' + req.connection.remoteAddress);
			}
	});
}

function send404(res){
	fs.readFile(
		__dirname + '/public/' + '404.html',
		{encoding: 'utf8'},
		function (err, data){
			if(err)
				throw err;
			res.send(data, 404);
	});
}

function initialize (app){

	app.use(function (req, res, next) {
	res.header('X-powered-by', 'PSWS');
  	next();
	});

	//The account authorization goes here
	app.use(function (req, res, next){
		require('./sds_auth.js').user._check_login(req, function(uid, req){
			if(uid == null || uid == 0)
				res.redirect('http://sdslabs.local/login');
		});
		next();
	});

	app.get('/', function (req, res) {
		res.render('index',
		{
			ip: global.getIP()
		})
		global.log('verbose', 'Sent homepage to client: ' + req.connection.remoteAddress);
	});

	app.get('/req', function(req, res){
		
	});

	app.get('/:folder/:file', function(req, res){
		send(req, res, req.params.folder+'/'+req.params.file);
	});


	app.get('*', function(req, res){
		send404(res);
	});
}

module.exports.initialize = initialize;