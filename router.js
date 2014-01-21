//Load the Global Function Module
var global = require('./global.js');

//Load Constants
var CONST = require('./constants.js');

//Load database
var db = require('./db.js');

// Load the objects module for map functions
var objects = require('./game/objects.js');

var fs = require('fs');

function send(req, res, file){
	var mime = require('mime')
	path = __dirname + '/public/' + file;
	fs.exists(path, function (exists){
			if(!exists)
				send404(res);
			else{
				res.contentType(mime.lookup(path))
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

	app.configure(function()
	{
		app.use(express.static(__dirname + '/public'));
	})
	
	app.use(function (req, res, next) {
		res.header('Server', 'SDSWS');
  		next();
	});

	//The account authorization goes here
	// app.use(function (req, res, next){
		// Production
		// require('./sds_auth.js').user._check_login(req, function(uid, req){
		// 	if(uid == null || uid == 0)
		// 		res.redirect('http://sdslabs.local/login');
		// 
		// next(); //Proceed iff this comes as true
		// });

		// Development
		// next(); 
	// });

	app.get('/:folder/:file', function(req, res){
		send(req, res, req.params.folder+'/'+req.params.file);
	});

	app.get('/', function (req, res) {
		res.render('index',
		{
			ip: global.getIP(),
			port: CONST.G_SERVER_PORT
		})
		global.log('verbose', 'Sent homepage to client: ' + req.connection.remoteAddress);
	});

	app.get('/maps', function (req, res) {
		res.render('maps')
		global.log('verbose', 'Sent maps page to client: ' + req.connection.remoteAddress);
	});

	app.get('/leaderboard', function(req, res) {
		res.render('leaderboard',
		{
			
		})
	})

	app.post('/leaderboard', function(req, res){
		db.fetchLeaderboard(req.body, function(results){
			res.write(JSON.stringify(results));
			res.send();
		})
	})

	// app.get('/:folder/:file', function(req, res){
	// 	console.log(req.params.folder, req.params.file)
	// 	send(req, res, req.params.folder+'/'+req.params.file);
	// });

	app.get('/json/map/update', function(req, res){
		// Production
		// require('./sds_auth.js').user._isDeveloper(req, function(result, req){
		// 	if(!result)
		// 		send404(res);
		var places = require('./JSON/maps/'+CONST.G_CUR_MAP+'/places.json');
		res.render('places', {'placeList':JSON.stringify(places.list)});
	});
	app.post('/json/map/update', function(req, res){
		// Production
		// require('./sds_auth.js').user._isDeveloper(req, function(result, req){
		// 	if(!result)
		// 		send404(res);
		var _res = objects.updateMap(CONST.G_CUR_MAP, req.body);
		fs.writeFile('./JSON/maps/iitr/iitr.json', _res, function(err){
			if(err)
				console.log(err);
		})
		res.write(_res);
		res.send();
	});
	
	app.get('*', function(req, res){
		send404(res);
	});
}

module.exports.initialize = initialize;