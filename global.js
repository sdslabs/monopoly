//Load Constants
var CONST = require('./constants.js');

//Load the winston module
var winston = require('winston');

//Load the filesystem module
var fs = require('fs');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
	//silent: !CONST.G_LOG_REQUESTS,
	level: CONST.G_SERVER_LOG_LEVEL,
	colorize: true,
	timestamp: false});

if(CONST.G_LOG_FILE!=null && CONST.G_LOG_FILE!='')
	winston.add(winston.transports.File, {
		filename: CONST.G_LOG_FILE,
	//	silent: !CONST.G_LOG_REQUESTS,
		level: CONST.G_SERVER_LOG_LEVEL,
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

	if(ml < 10)
		ml = '00' + ml;
	else if(ml <100)
		ml = '0' + ml;
	if(dd < 10)
		dd = '0' + dd;
	if(mm < 10)
		mm = '0' + mm;
	if(ss < 10)
		ss = '0' + ss;
	if(mi < 10)
		mi = '0' + mi;
	if(hh < 10)
		hh = '0' + hh;

		// winston.log(lvl, '[' + hh + ':' + mi + ':' + ss +':' + ml + ' ' + dd +'/'+ mm+ '] ' + text);
		winston.log(lvl, '[' + hh + ':' + mi + '] ' + text);
		if(lvl == 'error')
			error(text);
}

function error(text){
	fs.appendFile('logs/' + CONST.G_LOG_ERR_FILE, '\n' + new Date()+ text)
}

function getIP(){
	if(CONST.G_IP_ADDR == ''){
		var ifaces = require('os').networkInterfaces();
		var ipaddress = '';
		if(ifaces[CONST.G_IFACE] != null)
			return ifaces[CONST.G_IFACE][0].address;
	}else	
		return CONST.G_IP_ADDR;		
}

process.on('uncaughtException', function ( err ) {
    log('error', "Uncaught exception. Attempting to proceed anyway...");
    error(err);
});

module.exports.error = error;
module.exports.log = log;
module.exports.getIP = getIP;
