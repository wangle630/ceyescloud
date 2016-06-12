/**
 * Created by liyanan on 2016/2/26.
 */
var mysql=require("../public/javascripts/mysql/mysql.js");
exports.Auth= function(username,callback){
    console.error('Auth');
    var sql="SELECT * FROM t_device WHERE deviceSN=?  AND ENABLE='Yes'";
    var param=[username];
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            console.error('error');
            callback(err);
        }
        callback(null,vals);
    });
}
exports.SaveVideo = function(param1,param2,param3,param4,callback) {
    console.error('------SaveVideo START-------');
    console.error('param1:' + param1);
    console.error('param2:' + param2);
    console.error('param3:' + param3);
    console.error('param4:' + param4);

    mysql.conn.beginTransaction(function (err) {
        if (err) {
            throw err;
            console.log(err);
        }
        GetCountByIdType(param2, function (err, result) {
            if (err) {
                console.log('QUERY2 WRONG');
                return mysql.conn.rollback(function () {
                    callback(err);
                    throw err;
                });
                callback(err);
            }
            console.error('---result[0].count-----'+result[0].count);
            if (result[0].count <= 0) {
                var query1 = "UPDATE t_video SET TYPE =? WHERE hashed_id=? AND TYPE = ?";
                mysql.conn.query(query1, param1, function (err, result) {
                    if (err) {
                        return mysql.conn.rollback(function () {
                            throw err;
                        });
                        callback(err);
                    }
                    console.error('---UPDATE result.rowsAffected-----'+result.rowsAffected);
                    SaveVideo_Insert(param3, function (err, result) {
                        if (err) {
                            console.log('insert into t_video');
                            return mysql.conn.rollback(function () {
                                callback(err);
                                console.log('INSERT WRONG');
                                throw err;
                            });
                        }
                    });
                    console.error('---UpdateDeviceStorage-----');
                    UpdateDeviceStorage(param4, function (err, result) {
                        if (err) {
                            console.log('UpdateDeviceStorage');
                            return mysql.conn.rollback(function () {
                                callback(err);
                                console.log('UpdateDeviceStorage');
                                throw err;
                            });
                        }
                    });
                    mysql.conn.commit(function (err) {
                        if (err) {
                            return mysql.conn.rollback(function () {
                                console.log('COMMIT WRONG');
                                throw err;
                            });
                            callback(err);
                        }
                        callback(null);
                        console.error('COMMIT OK');
                        console.error('------SaveVideo END-------');
                    });
                });
            }
            });
        });
    };

GetCountByIdType = function(param,callback){
    var sql ="select count(id) count from t_video where hashed_id=?  AND TYPE =?  LIMIT 1 ";
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        callback(null,vals);
    });
}
SaveVideo_Insert = function(param,callback){
    var sql='INSERT INTO t_video(type,hashed_id,author,size,created_at,duration,format,vs_id,path,'+
        'file_name,private_flag,ctype,cversion,service_code,is_resume,tag,http_output_bytes,input_bytes,'+
        'output_idx,opaque,live_only,url,status,finished_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        callback(null,vals);
    });
}
UpdateDeviceStorage = function(param,callback){
    var sql="UPDATE t_device SET useStorage=useStorage+?  WHERE deviceSN=? AND ENABLE='Yes' ";
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        callback(null,vals);
    });
}
exports.GetCountByIdTypeFormat = function(param,callback){
    var sql="select count(id) count from t_video where hashed_id=?  AND TYPE =?  AND FORMAT=? LIMIT 1";
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        callback(null,vals);
    });
}
exports.RecordStart_Insert = function(param,callback){
    var sql = 'INSERT INTO t_video(type,hashed_id,author,url,svod_url,size,created_at,duration,format,vs_id,path,private_flag,ctype,cversion,service_code,is_resume,' +
        'tag,opaque,live_only,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        callback(null,vals);
    });
}
exports.UpdateTypeByHashed_id = function(param,callback){
    var sql="UPDATE t_video SET TYPE =? WHERE hashed_id=? AND TYPE = ?";
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        callback(null,vals);
    });
}
exports.RecordStop_Insert = function(param,callback){
    var sql='INSERT INTO t_video(type,hashed_id,vs_id,service_code,created_at,reach_end,is_resume,tag,'+
        'http_output_bytes,input_bytes,duration,format,output_idx,opaque,live_only,status,finished_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        callback(null,vals);
    });
}

exports.UserOffline_Insert = function(param,callback){
    var sql='INSERT INTO t_video(type,username,service_code,session_duration,disconnect_reason,vs_id,status) VALUES(?,?,?,?,?,?,?);';
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        callback(null,vals);
    });
}
exports.ThumbnailsCreate_Insert = function(param,callback){
    var sql='INSERT INTO t_thumbnails(type,hashed_id,vs_id,service_code,path,file_name,width,height,opaque,live_only, url) VALUES(?,?,?,?,?,?,?,?,?,?,?);';
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        callback(null,vals);
    });
}

