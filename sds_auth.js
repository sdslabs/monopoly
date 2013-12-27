var request= require('request');
var CONST = require('./constants.js');
var global = require('./global.js')

module.exports = {
    API_ROOT:CONST.G_API_ROOT,
    app_id : CONST.G_APP_ID,
    secret_key:CONST.G_API_KEY,
    send_request : function(moduleName,funcName,param,callback){
		param['app_id'] = this.app_id;
		param['secret_key'] = this.secret_key;
		param['func'] = funcName;
		param['module'] = moduleName;
		var query = require('querystring').stringify(param);
        global.log('verbose', 'Querying ' + query);
        request.post({
				uri:this.API_ROOT,
				body:query,
				headers:{
					"Content-Type":"application/x-www-form-urlencoded"
				}
			},function(err,response,body){
            if(err && response.statusCode != 200){
                global.log('warn', "Couldn't connect to sds api");
                callback(false);
            }
            else{
                // callback(JSON.parse(body));
            }
        });
    },
    user : {
        _check_login : function(req,callback){
			var userModule = this;
            module.exports.send_request('user','check_login',{'cookie':req.cookies.sds_login},function(uid){
				if(uid)
					userModule.uid = uid;
				callback(uid,req);
			});
        },


        check_login: function(cookie, callback){
            var userModule = this;
            module.exports.send_request('user','check_login',{'cookie':cookie},function(uid){
                if(uid)
                    userModule.uid = uid;
                callback(uid);
            });
        },
        details : function(type,callback){
			module.exports.send_request('user','details',{'type':type,'category': 'student','identity':this.uid},callback);
		}
    }
}

