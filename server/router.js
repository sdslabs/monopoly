function initialize (app){
	app.get('/', function (req, res) {
		res.sendfile(__dirname + '/index.html');
	});

	app.get('/favicon.ico', function(req, res){
		res.sendfile(__dirname + '/index.html');
	});
}

module.exports.initialize = initialize;