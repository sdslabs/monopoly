//Load Constants
var CONST = require('./constants.js');

//Load the Global Function Module
var global = require('./global.js');

//Load the Authorization Module  
var authorize = require('./authorize.js');

//Load the database module
var db = require('./db');

//Load the node framework modules
var express = require('express');
var http = require('http')
var app = express();

//Initialize Server 
var server = http.createServer(app);
var io = require('socket.io').listen(server, {log: CONST.G_LOG_REQUESTS});
server.listen(CONST.G_SERVER_PORT);
console.log("\nCurrent server time is "+ new Date()+'\n');

//Open up connection to database
db.connect(express, app);

//Initialize Router
var router = require('./router.js');
router.initialize(app);

//Initialize Authorization Socket Responses
authorize.initialize(io, express);

//Pop out a success notification
global.log('info', "Server running on \033[1m"+CONST.G_DOMAIN_NAME + '\033[0m\033[1;31m:' + CONST.G_SERVER_PORT + '\033[0m');