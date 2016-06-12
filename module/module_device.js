var mysql=require("../public/javascripts/mysql/mysql.js");

function Device(id,deviceSN,deviceType,deviceName,accountID,accountName,enable,deviceinfo,Created,Updated,useStorage,totalStorage){
    this.id = id;
    this.deviceSN = deviceSN;
    this.deviceType = deviceType;
    this.deviceName = deviceName;
    this.accountID = accountID;
    this.accountName = accountName;
    this.enable = enable;
    this.deviceinfo = deviceinfo;
    this.Created = Created;
    this.Updated = Updated;
    this.useStorage=useStorage,
    this.totalStorage=totalStorage
}

module.exports = Device;


//所有设备信息
Device.getAll = function(callback){
    var query = "SELECT id,deviceSN,deviceType,deviceState,deviceName,accountID,accountName,token,sipAccount,ENABLE,deviceInfo,Created,Updated,useStorage/1024 useStorage,totalStorage/1024  totalStorage   FROM t_device ORDER BY Created DESC" ;

    mysql.executeSql(
        query,
        function(err, rows) {
            if (err){
                callback(err)
                //throw err;
            }
            callback(null,rows);
        }
    );
};

//某个用户下所有可用设备
Device.getUserDevice = function(userid,callback){
    var query = " SELECT id,deviceSN,deviceType,deviceState,deviceName,accountID,accountName,enable,deviceInfo,Created,Updated,"+
                " CAST(useStorage AS DECIMAL(15,2)) useStorage, CAST(totalStorage AS DECIMAL(15,2)) totalStorage  FROM t_device"+
                " WHERE  accountID=? AND ENABLE='Yes' ORDER BY Created DESC";
    mysql.executeSql(
        query,
        [userid],
        function(err, rows) {
            if (err){
                callback(err)
                //throw err;
            }
            callback(null,rows);
        }
    );
};
//某个用户下可看直播源
Device.getVideoSource = function(userid,callback){
    //var query = " SELECT * FROM remote_guide.t_video_source a left join  remote_guide.t_video b" +
    // " on a.share_device_SN = b.author and b.type = '0' and  b.tag = 'output_flv_live_only'" +
    //    "where a.enable = 'Yes'  and a.account_id = ? ";
    var query="SELECT DISTINCT vs.share_device_SN share_device_SN,dvc.accountName share_account_name,dvc.deviceType share_device_type,"+
              " dvc.deviceName share_device_Name,v.hashed_id hashed_id,vs.state state FROM t_video_source  vs LEFT JOIN t_device dvc"+
              " ON dvc.deviceSN=vs.share_device_SN LEFT JOIN t_video v ON v.author=vs.share_device_SN AND v.type=0"+
              " AND v.tag='output_flv_live_only' WHERE vs.account_id=?   AND (vs.state=0 OR vs.state=1) AND vs.enable='Yes'  ORDER BY vs.share_device_sn";
    mysql.executeSql(
        query,
        [userid],
        function(err, rows) {
            if (err){
                callback(err)
                //throw err;
            }
            callback(null,rows);
        }
    );
};

Device.getLookDeviceSn = function(userid,callback){
    var query = " SELECT DISTINCT a.share_device_SN sn FROM remote_guide.t_video_source a left join  remote_guide.t_video b" +
        " on a.share_device_SN = b.author and b.type = '0' " +
        " where b.type = '0' AND a.enable = 'Yes'  and a.account_id = ? ";
    mysql.executeSql(
        query,
        [userid],
        function(err, rows) {
            if (err){
                callback(err)
                //throw err;
            }
            callback(null,rows);
        }
    );
};

//解除绑定
Device.unblind2 = function(deviced,callback){
    var query= "UPDATE t_device SET " +
        "enable='No',Updated=?" +
        "where id=?";
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    mysql.executeSql(
        query,  //添加工作记录的SQL
        [date,deviced],
        function(err,rows) {
            if (err){
                callback(err);
            }
            callback(null,rows)
        }
    );
};

//重命名设备 和 直播源对应的设备名
Device.rename = function(deviceID,deviceName,date,callback){
    var query1= "UPDATE t_device SET deviceName=?,Updated=? where id=?";
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var param1= [deviceName,date,deviceID];
   // var query2= "UPDATE t_video_source SET share_device_Name=?,Updated=? where share_device_id=?";
   // var param2=[deviceName,date,deviceID];
   // mysql.conn.beginTransaction(function (err) {
   //     if (err) {
   //         throw err;
   //         console.log(err);
   //     }
        mysql.executeSql(query1,param1,function(err,rows) {
            if (err) {
                return mysql.pool.rollback(function () {
                    console.log('first update t_device');
                    throw err;
                });
                callback(err)
            }
            callback(null, rows);
        }
            //mysql.conn.query(query2,param2,function (err,rows) {
            //            if (err) {
            //                console.log('second update t_video_source');
            //                return mysql.pool.rollback(function () {
            //                    callback(err);
            //                    throw err;
            //                });
            //                callback(err);
            //            }
            //        mysql.conn.commit(function (err) {
            //                if (err) {
            //                    return mysql.pool.rollback(function () {
            //                        throw err;
            //                    });
            //                    callback(err);
            //                }
            //                callback(null,rows);
            //            });
            //        }
            //    );
            //}


    )
}

Device.prototype.UpdateEnableInsertSource=function(videosourceid,callback){
    var device ={
        id : this.id,
        deviceSN : this.deviceSN,
        deviceType : this.deviceType,
        deviceName : this.deviceName,
        accountID : this.accountID,
        accountName: this.accountName,
        enable:'Yes',
        deviceinfo:this.deviceinfo,
        Created : this.Created,
        Updated : this.Updated
    };
    var videosource = {
        id : videosourceid,
        share_account_id : this.accountID,
        share_account_name : this.accountName,
        share_device_SN : this.deviceSN,
        share_device_id : this.id,
        share_device_type : this.deviceType,
        share_device_name : this.deviceName,
        account_id : this.accountID,
        account_name :this.accountName,
        Created : this.Created,
        Updated : this.Updated
    }
    mysql.conn.beginTransaction(function (err) {
        if (err) {
            throw err;
            console.log(err);
        }
        var date = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        var query1 = "UPDATE t_device SET accountID=?,accountName=?,ENABLE='Yes',updated=? ,deviceName = ? WHERE deviceSN=?" ;
        var param1=[device.accountID,device.accountName,device.Updated,device.deviceName,device.deviceSN];
        mysql.conn.query(query1,param1, function(err,rows) {
                if (err) {
                    return  mysql.conn.rollback(function () {
                        console.log('first update t_device');
                        throw err;
                    });
                    callback(err)
                }
                var query2= " INSERT INTO t_video_source (id,share_device_SN,share_device_id,account_id,account_name,enable,Created,Updated,state )VALUES(?,?,?,?,?,?,?,?,?) ; ";
            var param2=[videosource.id,videosource.share_device_SN,videosource.share_device_id,videosource.account_id,videosource.account_name,'Yes',videosource.Created,videosource.Updated,0];
            mysql.conn.query(query2,param2,function (err,rows) {
                        if (err) {
                            console.log('second update t_video_source');
                            return mysql.conn.rollback(function () {
                                callback(err);
                                throw err;
                            });
                            callback(err);
                        }
                        mysql.conn.commit(function (err,rows) {
                            if (err) {
                                return mysql.conn.rollback(function () {
                                    throw err;
                                });
                                callback(err);
                            }
                            callback(null,rows);
                        });
                    }
                );
            }
        );
    });
}

//解除绑定事务  更新device enable  删除直播源数据
Device.unblind = function(deviceSN,userid,callback){
    mysql.conn.beginTransaction(function (err) {
        if (err) {
            throw err;
            console.log(err);
        }
        var query1= "UPDATE t_device SET accountID=NULL,accountName=NULL ,enable='No',Updated=? where deviceSN=? ";
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var param1=[date,deviceSN];
        mysql.conn.query(query1,param1, function(err) {
                if (err) {
                    return  mysql.conn.rollback(function () {
                        console.log('first update t_device');
                        throw err;
                    });
                    callback(err)
                }
                var query2= "DELETE FROM t_video_source WHERE share_device_SN=?";
                var param2=[deviceSN];
            mysql.conn.query(query2,param2,function (err,rows) {
                        if (err) {
                            console.log('second update t_video_source');
                            return mysql.conn.rollback(function () {
                                callback(err);
                                throw err;
                            });
                            callback(err);
                        }
                    mysql.conn.commit(function (err) {
                            if (err) {
                                return mysql.conn.rollback(function () {
                                    throw err;
                                });
                                callback(err);
                            }
                            callback(null,rows);
                        });
                    }
                );
            }
        );
    });

};

//查询设备详细信息
Device.getDetail = function(deviceid,callback){
    var query = "SELECT deviceinfo FROM t_device " +  //获取用户信息
        "WHERE id=? " +
        "and enable='yes'" +
        "limit 1";
    var param=[deviceid];
    mysql.executeSql(query,param,function(err,row) {
            if (err){
                callback(err);
            }
            callback(null,row[0].deviceinfo)
        }
    );
};


//新增绑定设备
Device.prototype.save = function(callback){
    //存入数据库的内容
    var device ={
        id : this.id,
        deviceSN : this.deviceSN,
        deviceType : this.deviceType,
        accountID : this.accountID,
        accountName: this.accountName,
        enable:'Yes',
        deviceinfo:this.deviceinfo,
        Created : this.Created,
        Updated : this.Updated,
        offlineresolution: this.offlineresolution,
        offlineaudioCodec: this.offlineaudioCodec,
        offlinevideoCodec: this.offlinevideoCodec,
        offlinefps: this.offlinefps,
        offlinebps: this.offlinebps,
        localvideoupload: this.localvideoupload,
        deletelocalfile: this.deletelocalfile
    };
    var query = "INSERT INTO t_device (id,deviceSN,deviceType,accountID,accountName,enable,deviceinfo,Created,Updated) " +
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)" ;
    var param=[device.id,device.deviceSN,device.deviceType,device.accountID,device.accountName,device.enable,device.deviceinfo,device.Created,device.Updated];
    mysql.executeSql(query,param,function(err,row) {
            if (err){
                console.log(err);
                callback(err);
            }
            console.warn(row);
            callback(null,row)
        }
    );
};


//绑定前检查是否重复
Device.getOneBySN = function(deviceSN,callback){
    var query = "SELECT enable FROM t_device WHERE deviceSN=? ORDER BY ENABLE DESC LIMIT 1"
    var param=[deviceSN];
    mysql.executeSql(query,param,function(err, row) {
            if (err) console.log(err);
            callback(null,row);
        }
    );
};

Device.getBindUser =function(accountID,accountName,callback){
    var query = " SELECT * FROM t_account WHERE id=? AND accountName=? LIMIT 1";
    var param=[accountID,accountName];
    mysql.executeSql(query,param,function(err, row) {
            if (err) console.log(err);
            callback(null,row);
        }
    );
}


//新增设备（绑定信息） ＋ 新增设备meidia信息 ＋ 设备分享自己直播源  事务回滚
Device.prototype.save2 = function(mediaconfid,videosourceid,callback) {
    console.warn('开始事务处理…………………………');
    //存入数据库的内容
    var device ={
        id : this.id,
        deviceSN : this.deviceSN,
        deviceType : this.deviceType,
        deviceName : this.deviceName,
        accountID : this.accountID,
        accountName: this.accountName,
        enable:'Yes',
        deviceinfo:this.deviceinfo,
        Created : this.Created,
        Updated : this.Updated,
        useStorage:this.useStorage,
        totalStorage:this.totalStorage
    };

    var mediaconf ={
        id : mediaconfid,
        deviceid :this.id,
        resolution : '1280x720',
        audioCodec : 'AAC',
        videoCodec : 'H264',
        fps : '26',
        bps : '1024',
        sound : 'Yes',
        Updated : this.Updated,
        offlineresolution: '1280x720',
        offlineaudioCodec:'AAC',
        offlinevideoCodec: 'H264',
        offlinefps: '26',
        offlinebps: '1024',
        localvideoupload: '0',
        deletelocalfile: '1'
    }

    var videosource = {
        id : videosourceid,
        share_account_id : this.accountID,
        share_account_name : this.accountName,
        share_device_SN : this.deviceSN,
        share_device_id : this.id,
        share_device_type : this.deviceType,
        share_device_name : this.deviceName,
        account_id : this.accountID,
        account_name :this.accountName,
        Created : this.Created,
        Updated : this.Updated
    }

    mysql.conn.beginTransaction(function (err) {
        if (err) {
            throw err;
            console.log(err);
        }
        //插入设备表
        var query1 = "INSERT INTO t_device (id,deviceSN,deviceType,deviceName,accountID,accountName,enable,deviceinfo,Created,Updated,useStorage,totalStorage) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)" ;
        var param1=[device.id,device.deviceSN,device.deviceType,device.deviceName,device.accountID,device.accountName,device.enable,device.deviceinfo,device.Created,device.Updated,device.useStorage,device.totalStorage];
        mysql.executeSql(query1,param1,function (err, result) {
            if (err) {
                return mysql.conn.rollback(function () {
                    console.log('first insert into t_device');
                    throw err;
                });
                callback(err);
            }
                //插入直播配置表
                var query2 = "INSERT INTO t_media_config (id,device_id,resolution,audioCodec,videoCodec,fps,bps,sound,Updated,offlineresolution,offlineaudioCodec,offlinevideoCodec,offlinefps,offlinebps,localvideoupload,deletelocalfile) " +
                    " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)" ;
                var param2=[mediaconf.id,mediaconf.deviceid,mediaconf.resolution,mediaconf.audioCodec,mediaconf.videoCodec,mediaconf.fps,mediaconf.bps,mediaconf.sound,mediaconf.Updated,mediaconf.offlineresolution,mediaconf.offlineaudioCodec,mediaconf.offlinevideoCodec,mediaconf.offlinefps,mediaconf.offlinebps,mediaconf.localvideoupload,mediaconf.deletelocalfile]
                mysql.executeSql(query2,param2,function (err, result) {
                    if (err) {
                        console.log('second insert into t_media_config');
                        return mysql.conn.rollback(function () {
                            callback(err);
                            throw err;
                        });
                        callback(err);
                    }
                        //插入直播源
                        var query3 = "INSERT INTO t_video_source (id,share_device_SN,share_device_id,account_id,account_name,enable,Created,Updated,state) " +
                            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)" ;
                        var param3=[videosource.id,videosource.share_device_SN,videosource.share_device_id,videosource.account_id,videosource.account_name,'Yes',videosource.Created,videosource.Updated,0];
                        mysql.executeSql(query3,param3,function (err, result) {
                                if (err) {
                                    console.log('3rd insert into t_video_source');
                                    return mysql.conn.rollback(function () {
                                        callback(err);
                                        throw err;
                                    });
                                    callback(err);
                                }
                                mysql.conn.commit(function (err) {
                                    console.log('enter the commit');
                                    if (err) {
                                        return mysql.conn.rollback(function () {
                                            throw err;
                                        });
                                        callback(err);
                                    }
                                    callback(null);
                                    console.log('success');
                                });
                            }
                        );
                    }
                );
            }
        );
    });
};

Device.getBindInfo = function(param,callback){
    var query= "SELECT accountID,accountName FROM t_device WHERE deviceSN=?";
    mysql.executeSql(query,param,function(err,rows) {
            if (err){
                callback(err);
            }
            callback(null,rows)
        }
    );
};
Device.deviceHardwareInfo = function(param,callback){
    var query= "UPDATE t_device SET " +
        "deviceInfo=?" +
        "where deviceSN=?";
    mysql.executeSql(query,param,function(err,rows) {
            if (err){
                callback(err);
            }
            callback(null,rows)
        }
    );
};