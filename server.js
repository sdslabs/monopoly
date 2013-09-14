//Load Constants
var CONST = require('./constants.js');

//Load the Global Function Module
var global = require('./global.js');

//Load the Authorization Module  
var authorize = require('./authorize.js');

//Load the database module
var db = require('./db');

//Load the filesystem module
var fs = require('fs');

//Load the node framework modules
var express = require('express');
var https = require('https');
var app = express();

app.set('views', __dirname + '/public');
app.set('view engine', 'jade');

//Initialize Server 
var options = {
	key                : fs.readFileSync('./ssl/'+CONST.G_SSL_KEY_FILE),
  	cert               : fs.readFileSync('./ssl/'+CONST.G_SSL_CERT_FILE),
  	requestCert        : true,
  	rejectUnauthorized : false,
  	passphrase         : CONST.G_SSL_CERT_PASSPHRASE,
  	ciphers            : 'AES256-SHA'
 };
var server = https.createServer(options, app);

//Initialize the socketio module
options.log = CONST.G_LOG_CONNECTION_MESSAGES;
var io = require('socket.io').listen(server, options);

//Set the server port
server.listen(CONST.G_SERVER_PORT, console.log("\nCurrent server time is "+ new Date()+'\n'));

//Open up connection to database
db.connect(express, app);

//Initialize Router
var router = require('./router.js');
router.initialize(app);

//Initialize Authorization Socket Responses
authorize.initialize(io, express);

//Pop out a success notification
global.log('info', "Server running on \033[1m"+CONST.G_DOMAIN_NAME + '\033[0m\033[1;31m:' + CONST.G_SERVER_PORT + '\033[0m');
