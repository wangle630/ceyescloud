var mysql=require("mysql");
var config=require("../../../config.js");
var pool = mysql.createPool({
    host: config.db_ip,
    user: config.db_user,
    password: config.db_password,
    database: config.db_database,
    port:config.db_port,
	dateStrings: true
});
exports.conn=mysql.createConnection({
    host: config.db_ip,
    user: config.db_user,
    password: config.db_password,
    database: config.db_database,
    port:config.db_port,
	dateStrings: true
});


exports.executeSqlNoParam=function(sql,callback){
	pool.getConnection(function(err,conn){
		if(err){
			callback(err,null);
		}else{
			conn.query(sql,function(qerr,vals){
				callback(qerr,vals);
				conn.release();
			});
		}
	});
};
exports.executeSql=function(sql,param,callback){
	pool.getConnection(function(err,conn){
		if(err){
			callback(err,null,null);
		}else{
			conn.query(sql,param,function(qerr,vals){
				callback(qerr,vals);
				conn.release();
			});
		}
	});
};