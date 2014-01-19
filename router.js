//Load the Global Function Module
var global = require('./global.js');

//Load Constants
var CONST = require('./constants.js');

//Load database
var db = require('./db.js');

// var events = require('events');

var fs = require('fs');

function send(req, res, file){
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
		res.header('Server', 'SDSWS');
  		next();
	});

	//The account authorization goes here
	app.use(function (req, res, next){
		// Production
		// require('./sds_auth.js').user._check_login(req, function(uid, req){
		// 	if(uid == null || uid == 0)
		// 		res.redirect('http://sdslabs.local/login');
		// req.session.uid = uid;
		// next(); //Proceed iff this comes as true
		// });

		// Development
		next(); 
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



	app.get('/:folder/:file', function(req, res){
		send(req, res, req.params.folder+'/'+req.params.file);
	});

	app.get('/json/map/update', function(req, res)
	{
		var places = require('./game/places.js')
		// res.write(JSON.stringify(places.placeList))
		// res.send()
		res.render('places', {'placeList':JSON.stringify(places.placeList)})
	})
	app.post('/json/map/update', function(req, res)
	{
		var map = require('./game/map.json')
		var i = 0
		for(var key in req.body)
		{
			var property = req.body[key]
			if(key in map.properties)
			{
				for(var attr in property)
				{
					var attrValue = property[attr]
					map.properties[key][attr] = attrValue
				}
				map.properties[key].id = ++i
			}
		}
		fs.writeFile('./game/map.json', JSON.stringify(map, null, 4))
	});
	
	app.get('*', function(req, res){
		send404(res);
	});
}

module.exports.initialize = initialize;