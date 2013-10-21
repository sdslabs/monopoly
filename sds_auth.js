var request= require('request');
module.exports = {
    /**
     * The SDSLabs API ROOT
     */
    /**
     * The application ID
     */
    API_ROOT:"",
    app_id : "",
    /**
     * The secret key
     */
    secret_key:"",
    /**
     * The send request function routes all requests
     */
    send_request : function(moduleName,funcName,param,callback){
		param['app_id'] = this.app_id;
		param['secret_key'] = this.secret_key;
		param['func]' = funcName;
		param['module'] = moduleName;
		var query = require('querystring').stringify(param);
        request.post({
				uri:this.API_ROOT,
				body:query,
				headers:{
					"Content-Type":"application/x-www-form-urlencoded"
				}
			},function(err,response,body){
            if(err && response.statusCode != 200){
                console.log("Error In Getting Results");
                callback(false);
            }
            else{
				console.log(body);
                callback(JSON.parse(body));
            }

        });
    },
    /**
     * User module
     */
    user : {
        /**
         * Check whether a user is logged in or not
         */
        check_login: function(cookie, callback){
            //console.log(req);
            var userModule = this;
            module.exports.send_request('user','check_login',{'cookie':cookie},function(uid){
                if(uid)
                    userModule.uid = uid;
                callback(uid,req);
            });
        },
        _check_login : function(req,callback){
            //console.log(req);
			var userModule = this;
            module.exports.send_request('user','check_login',{'cookie':req.cookies.sds_login},function(uid){
				if(uid)
					userModule.uid = uid;
				callback(uid,req);
			});
        },
        /**
         * Gets the details about a user
         */
        details : function(type,callback){
			module.exports.send_request('user','details',{'type':type,'category': 'student','identity':this.uid},callback);
		}
    }
}
