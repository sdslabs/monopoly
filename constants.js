
var constant = require('./JSON/constants.json');
var constantPWD = require('./JSON/password.json');

// const G_MAX_PLAYERS_PER_GAME    = parseInt(constant.G_MAX_PLAYERS_PER_GAME);
const G_SERVER_PORT             = parseInt(constant.G_SERVER_PORT);
const G_DOMAIN_NAME             = constant.G_DOMAIN_NAME;
const G_EXPRESS_SESSION_SECRET  = constant.G_EXPRESS_SESSION_SECRET;
const G_SSL_KEY_FILE            = constant.G_SSL_KEY_FILE;
const G_SSL_CERT_FILE           = constant.G_SSL_CERT_FILE;
const G_SSL_CERT_PASSPHRASE     = constantPWD.G_SSL_CERT_PASSPHRASE;

const G_LOG_CONNECTION_MESSAGES = parseInt(constant.G_LOG_CONNECTION_MESSAGES)==0?false:true;
const G_LOG_FILE                = constant.G_LOG_FILE;
const G_SERVER_LOG_LEVEL        = constant.G_SERVER_LOG_LEVEL;

const G_MYSQL_DB                = constant.G_MYSQL_DB;
const G_MYSQL_HOST              = constant.G_MYSQL_HOST;
const G_MYSQL_USERNAME          = constantPWD.G_MYSQL_USERNAME;
const G_MYSQL_PASSWORD          = constantPWD.G_MYSQL_PASSWORD; 

// module.exports.G_MAX_PLAYERS_PER_GAME    = G_MAX_PLAYERS_PER_GAME;
module.exports.G_SERVER_PORT             = G_SERVER_PORT;
module.exports.G_LOG_CONNECTION_MESSAGES = G_LOG_CONNECTION_MESSAGES;
module.exports.G_MYSQL_USERNAME          = G_MYSQL_USERNAME;
module.exports.G_MYSQL_PASSWORD          = G_MYSQL_PASSWORD;
module.exports.G_MYSQL_DB                = G_MYSQL_DB;
module.exports.G_EXPRESS_SESSION_SECRET  = G_EXPRESS_SESSION_SECRET;
module.exports.G_DOMAIN_NAME             = G_DOMAIN_NAME;
module.exports.G_LOG_FILE                = G_LOG_FILE;
module.exports.G_MYSQL_HOST              = G_MYSQL_HOST;
module.exports.G_SSL_CERT_PASSPHRASE     = G_SSL_CERT_PASSPHRASE;
module.exports.G_SSL_KEY_FILE            = G_SSL_KEY_FILE;
module.exports.G_SSL_CERT_FILE           = G_SSL_CERT_FILE;
module.exports.G_SERVER_LOG_LEVEL        = G_SERVER_LOG_LEVEL;