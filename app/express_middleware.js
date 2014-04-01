//Load the stylus module
var stylus = require('stylus');

module.exports.init =  function(app, express) {
	
	app.use(function (req, res, next) {
		res.header('Server', 'SDSWS');
  		next();
	});

	//Configure Express to use Jade
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;

	//Configure Express to use Stylus
	app.use(stylus.middleware({
	debug: true,
	force: true,
	src: __dirname + '/stylesheets/',
	dest: __dirname + '/public/css/',
	// compress: true
	}));

	//Tell express to parse the body
	app.use(express.json());
	app.use(express.urlencoded());

	// Tell express to serve everything from /public
	app.use(express.static(__dirname + '/public'));

	// Tell express to enable routing
	app.use(app.router);
	//Initialize Router
	console.log(1111)
	console.log(require('./router.js').initialize)
	var router = require('./router.js').initialize(app);
}