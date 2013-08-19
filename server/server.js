//Load Constants
var CONST = require('./constants.js');

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

//Open up connection to database
db.connect(express, app);

//Initialize Router
var router = require('./router.js');
router.initialize(app);

//Initialize Authorization Socket Responses
authorize.initialize(io, express);

