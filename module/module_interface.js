/**
 * Created by liyanan on 2016/3/1.
 */
var mysql=require("../public/javascripts/mysql/mysql.js");
exports.GetConfigInfo= function(param,callback){
    var sql=" SELECT resolution,audioCodec,videoCodec,fps,bps,sound,Updated FROM t_media_config  WHERE device_id=(SELECT id FROM t_device WHERE deviceSn=?);";
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            callback(err);
        }
        callback(null,vals);
    });
}