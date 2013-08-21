//Load Constants
var CONST = require('./constants.js');

//Load the winston module
var winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
	//silent: !CONST.G_LOG_REQUESTS,
	colorize: true,
	timestamp: false});

if(CONST.G_LOG_FILE!=null)
	winston.add(winston.transports.File, {
		filename: CONST.G_LOG_FILE,
	//	silent: !CONST.G_LOG_REQUESTS,
		colorize: true,
		timestamp: false
	});



function log(lvl, text){
	var today = new Date();

	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yy = today.getFullYear();

	var ml = today.getMilliseconds();
	var ss = today.getSeconds();
	var mi = today.getMinutes();
	var hh = today.getHours();

	if(dd <10)
		dd = '0' + dd;
	if(mm<10)
		mm = '0' + mm;
	if(ss<10)
		ss = '0' + ss;
	if(mi<10)
		mi = '0' + mi;
	if(hh<10)
		hh = '0' + hh;

		winston.log(lvl, '[' + hh + ':' + mm + ':' + ss +':' + ml + ' ' + dd +'/'+ mm+ '] ' + text);
}

module.exports.log = log;
