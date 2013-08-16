
var constant = require('./constants.json');

const G_MAX_PLAYERS_PER_GAME = parseInt(constant.G_MAX_PLAYERS_PER_GAME);
const G_SERVER_PORT = parseInt(constant.G_SERVER_PORT);
const G_LOG_REQUESTS = parseInt(constant.G_LOG_REQUESTS)==0?false:true;
const G_MYSQL_USERNAME = constant.G_MYSQL_USERNAME;
const G_MYSQL_PASSWORD = constant.G_MYSQL_PASSWORD 
const G_MYSQL_DB = constant.G_MYSQL_DB
const G_EXPRESS_SESSION_SECRET = constant.G_EXPRESS_SESSION_SECRET

module.exports.G_MAX_PLAYERS_PER_GAME = G_MAX_PLAYERS_PER_GAME;
module.exports.G_SERVER_PORT = G_SERVER_PORT;
module.exports.G_LOG_REQUESTS = G_LOG_REQUESTS;
module.exports.G_MYSQL_USERNAME = G_MYSQL_USERNAME;
module.exports.G_MYSQL_PASSWORD = G_MYSQL_PASSWORD;
module.exports.G_MYSQL_DB = G_MYSQL_DB;
module.exports.G_EXPRESS_SESSION_SECRET = G_EXPRESS_SESSION_SECRET;