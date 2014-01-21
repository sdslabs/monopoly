
var constant = require('./JSON/constants.json');
var constantPWD = require('./JSON/password.json');

module.exports.G_SERVER_PORT             = parseInt(constant.G_SERVER_PORT);//G_SERVER_PORT;
module.exports.G_LOG_CONNECTION_MESSAGES = parseInt(constant.G_LOG_CONNECTION_MESSAGES)==0?false:true;
module.exports.G_LDB_COUNT               = constant.G_LDB_COUNT;
module.exports.G_MYSQL_USERNAME          = constantPWD.G_MYSQL_USERNAME;
module.exports.G_MYSQL_PASSWORD          = constantPWD.G_MYSQL_PASSWORD;
module.exports.G_MYSQL_DB                = constant.G_MYSQL_DB;
module.exports.G_CUR_MAP                 = constant.G_CUR_MAP;
module.exports.G_EXPRESS_SESSION_SECRET  = constant.G_EXPRESS_SESSION_SECRET;
module.exports.G_LOG_FILE                = constant.G_LOG_FILE;
module.exports.G_LOG_ERR_FILE            = constant.G_LOG_ERR_FILE;
module.exports.G_MYSQL_HOST              = constant.G_MYSQL_HOST;
module.exports.G_SERVER_LOG_LEVEL        = constant.G_SERVER_LOG_LEVEL;
module.exports.G_IFACE					 = constant.G_IFACE;
module.exports.G_IP_ADDR                 = constant.G_IP_ADDR;
module.exports.G_DB_SYNC_TIME            = parseInt(constant.G_DB_SYNC_TIME);

module.exports.G_APP_ID					 = constantPWD.G_APP_ID;
module.exports.G_API_KEY				 = constantPWD.G_API_KEY;

module.exports.G_API_ROOT				 = constant.G_API_ROOT;

// Production
// module.exports.G_SSL_KEY_FILE            = constant.G_SSL_KEY_FILE;
// module.exports.G_SSL_CERT_FILE           = constant.G_SSL_CERT_FILE;
// module.exports.G_SSL_CERT_PASSPHRASE     = constantPWD.G_SSL_CERT_PASSPHRASE;