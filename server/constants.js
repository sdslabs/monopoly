
var constant = require('./constants.json');

const G_MAX_PLAYERS_PER_GAME = parseInt(constant.G_MAX_PLAYERS_PER_GAME);
const G_SERVER_PORT = parseInt(constant.G_SERVER_PORT);
const G_LOG_SOCKETIO_REQUESTS = parseInt(constant.G_LOG_SOCKETIO_REQUESTS)==0?false:true;


module.exports.G_MAX_PLAYERS_PER_GAME = G_MAX_PLAYERS_PER_GAME;
module.exports.G_SERVER_PORT = G_SERVER_PORT;
module.exports.G_LOG_SOCKETIO_REQUESTS = G_LOG_SOCKETIO_REQUESTS;