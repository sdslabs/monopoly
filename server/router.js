function initialize (app){
	app.get('/', function (req, res) {
		res.sendfile(__dirname + '/public/index.html');
	});

	// app.get('/favicon.ico', function(req, res){
	// 	res.sendfile(__dirname + '/favicon.ico');
	// });
}

module.exports.initialize = initialize;