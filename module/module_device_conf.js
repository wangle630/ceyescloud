var mysql=require("../public/javascripts/mysql/mysql.js");

function Device_conf(id,deviceid,deviceSN,deviceType,resolution,audioCodec,videoCodec,fps,bps,sound,Updated){
    this.id = id;
    this.deviceid = deviceid;
    this.deviceSN = deviceSN;
    this.deviceType = deviceType;
    this.resolution = resolution;
    this.audioCodec = audioCodec;
    this.videoCodec = videoCodec;
    this.fps = fps;
    this.bps = bps;
    this.sound = sound;
    this.Updated = Updated;
}

module.exports = Device_conf;


//根据设备id查找media配置信息
Device_conf.getConfbyDev = function(mediaid,callback){
    var query = "SELECT * FROM t_media_config " +  //获取用户信息
        "WHERE device_id=? " +
        "limit 1";
    var param=[mediaid];
    mysql.executeSql(query,param,function(err, rows) {
            if (err){
                callback(err);
            }
            callback(null,rows);
        }
    );
};

//根据media_id查找media配置信息
Device_conf.getConfbyID = function(mediaid,callback){
    var query = "SELECT * FROM t_media_config " +  //获取用户信息
        "WHERE id=? " +
        "limit 1";
    mysql.executeSql(
        query,
        [mediaid],
        function(err, rows) {
            if (err){
                callback(err);
            }
            callback(null,rows);
        }
    );
};
//根据media_id查找media配置信息
Device_conf.getConfbySN = function(deviceSN,callback){
    var query = "SELECT m.id,m.updated FROM t_media_config m,t_device d WHERE d.id=m.device_id AND d.deviceSN=? LIMIT 1";
    mysql.executeSql(
        query,
        [deviceSN],
        function(err, rows) {
            if (err){
                callback(err);
            }
            callback(null,rows);
        }
    );
};



//更新设备配置信息
Device_conf.update = function(param,callback){
    var query= "UPDATE t_media_config SET resolution=?,audioCodec=?,videoCodec=?,fps=?,bps=?,offlineresolution=? ,offlineaudioCodec=?,offlinevideoCodec=?,"+
                "offlinefps=?,offlinebps=?,localvideoupload=?,deletelocalfile=?,Updated=?  where id=?";

    mysql.executeSql(query,param,function(err,rows) {
            if (err){
                console.log(err);
                callback(err);
            }
            callback(err,rows);
        }
    );
};

