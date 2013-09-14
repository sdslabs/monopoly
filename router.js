//Load the Global Function Module
var global = require('./global.js');

var events = require('events');


// function deleteSocket(err){
// 	events.EventEmitter.call(this);
// }

// deleteSocket.super_ = events.EventEmitter;

// deleteSocket.prototype = Object.create(events.EventEmitter.prototype, {
//     constructor: {
//         value: deleteSocket,
//         enumerable: false
//     }
// });

// deleteSocket.prototype.erase = function(SocketID) {
// 	this.erase = erase;
// 	erase(SocketID, function(SocketID){
// 		this.emit('expiredSession', SocketID);
// 	});
// }



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

	app.get('/public/icons/lightbulb_icon48.png', function(req, res){
		res.sendfile(__dirname + '/public/icons/lightbulb_icon48.png');
		global.log('info', 'Sent file: /public/icons/lightbulb_icon48.png to client: ' + req.connection.remoteAddress);
	})

	// res.session.destroy(function(){

	// });

}

module.exports.initialize = initialize;