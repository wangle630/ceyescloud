var mysql=require("../public/javascripts/mysql/mysql.js");
var crypto = require('crypto');
function  Friend (accountid,relid){
    this.account_id = accountid;
    this.rel_account_id = relid;
}
module.exports = Friend;

Friend.prototype.save = function(callback){
    //存入数据库的内容
    var Friend ={
        accountid : this.account_id,
        relid : this.rel_account_id

    };
    var query = "INSERT INTO t_friends (account_id,rel_account_id) " +
        " VALUES ( ?, ?)" ;
    var param=[Friend.accountid,Friend.relid];
    mysql.executeSql(query,param,function(err,vals) {
            if (err){
                console.log(err);
                callback(err);
            }
            callback(null,vals)
        }
    );
};
Friend.getOne = function(userid,refid,callback){
    var query = "SELECT * FROM t_friends WHERE account_id = ? AND rel_account_id = ?";
    mysql.executeSql(query,[userid,refid], function (err,row) {
        if(err){
            callback(err);
        }
        callback(err,row);
    })
}
Friend.updateShare = function (sn,userid,callback){
    var query = "UPDATE t_video_source SET ENABLE = 'No' WHERE share_device_SN = ? AND account_id <> ?";
    mysql.executeSql(query,[sn,userid],function(err,vs){
        if(err){
            callback(err);
        }
    })
}

Friend.savedisposableShare = function(userid,picks,sn,hashedid,callback){
    var md5 = crypto.createHash('md5');
    date = new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
    var deviceID ;
    var query = "SELECT id FROM t_device WHERE deviceSN = ? AND accountID=? LIMIT 1";
    mysql.executeSql(query,[sn,userid],function(err,rows){
        if(err){
            callback(err);
        }
        if(rows){
            var videoS={
                sn : sn,
                deviceId :rows[0].id,
                hashedid :hashedid
            }
            picks.forEach(function(pick){
                var query = "UPDATE t_video_source SET ENABLE = 'No' WHERE share_device_SN = ? AND account_id <> ? AND share_device_id = ? AND state = '2'";
                mysql.executeSql(query,[videoS.sn,pick.id,videoS.deviceId],function(err,vs){
                    if(err){
                        callback(err) ;
                    }

                    var videoid = crypto.createHash('md5').update(videoS.sn + videoS.deviceId +pick.id+ date).digest('hex');
                    query = "INSERT INTO t_video_source (id,share_device_SN,share_device_id,account_id,account_name,enable,hashed_id,Created,Updated,state) " +
                        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)" ;
                    mysql.executeSql(query,[videoid,sn,videoS.deviceId,pick.id,pick.text,'Yes',hashedid,date,date,'2'],function (err,val){
                        if(err){
                            callback(null);
                        }

                    })

                })
            })
        }
    })


}


Friend.saverecordsShare = function(userid,picks,sn,vid,callback){
    var md5 = crypto.createHash('md5');
    date = new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
    var deviceID ;
    var query = "SELECT id FROM t_device WHERE deviceSN = ? AND accountID=? LIMIT 1";
    mysql.executeSql(query,[sn,userid],function(err,rows){
        if(err){
            callback(err);
        }
        if(rows){
            var videoS={
                sn : sn,
                deviceId :rows[0].id,
                hashedid :vid
            }
            var query = "UPDATE t_video_source SET ENABLE = 'No' WHERE hashed_id = ? AND  share_device_SN = ?  AND share_device_id = ? AND state = '3'";
            mysql.executeSql(query,[videoS.hashedid,videoS.sn,videoS.deviceId],function(err,vs){
                if(err){
                    callback(err) ;
                }
                picks.forEach(function(pick){


                    var videoid = crypto.createHash('md5').update(videoS.sn + videoS.deviceId +pick.id+ date).digest('hex');
                    query = "INSERT INTO t_video_source (id,share_device_SN,share_device_id,account_id,account_name,enable,hashed_id,Created,Updated,state) " +
                        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)" ;
                    mysql.executeSql(query,[videoid,sn,videoS.deviceId,pick.id,pick.text,'Yes',videoS.hashedid,date,date,'3'],function (err,val){
                        if(err){
                            callback(null);
                        }

                    })

                })
            })
            callback(null);
        }
    })


}



Friend.saveShare = function(userid,picks,sn,deviceId,callback){
    date = new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
    var query = "SELECT id FROM t_device WHERE deviceSN = ? AND accountID=? LIMIT 1";
    mysql.executeSql(query,[sn,userid],function(err,row){
        if(err){
            callback(err);
        }


        var videoS={
            sn : sn,
            deviceId :row[0].id
        }
        picks.forEach(function(pick){
            /* var query = "SELECT * FROM t_video_source  WHERE share_device_SN =? AND account_id = ? AND share_device_id=?";
             mysql.executeSql(query,[videoS.sn,pick.id,videoS.deviceId],function(err,vs){
             if(err){
             callback(err) ;
             }
             if(vs.length>0){
             if(vs[0].enable !='Yes'){
             query = "UPDATE t_video_source set enable = 'Yes' WHERE share_device_SN =? AND account_id = ? AND share_device_id=?"
             var pams = [videoS.sn,pick.id,videoS.deviceId];
             mysql.executeSql(query,pams,function(err,vs){
             if(err){
             callback(err) ;
             }
             callback(null);
             })
             }
             }else{*/
            videoid = crypto.createHash('md5').update(videoS.sn + videoS.deviceId +pick.id+ date).digest('hex');
            query = "INSERT INTO t_video_source (id,share_device_SN,share_device_id,account_id,account_name,enable,hashed_id,Created,Updated,state) " +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)" ;
            mysql.executeSql(query,[videoid,sn,videoS.deviceId,pick.id,pick.text,'Yes',null,date,date,'1'],function (err,val){
                if(err){
                    callback(err);
                }
            })
        })
        callback(null);
    })

}

Friend.getrecordsQeryShare = function(type,userid,sn,vid,callback){
    var query = "SELECT id FROM t_device WHERE deviceSN = ? AND accountID=? LIMIT 1";
    mysql.executeSql(query,[sn,userid],function(err,row) {
        query = "SELECT a.id,a.`accountName`,(CASE WHEN v.`hashed_id` IS NULL THEN 0 ELSE 1 END) AS type ,v.hashed_id AS hashedid FROM t_account a JOIN t_friends f ON  a.id = f.rel_account_id "
            + " LEFT JOIN t_video_source v ON a.`id` = v.`account_id` AND( v.share_device_SN = ? AND v.`enable` = 'Yes'AND v.state = ? AND v.hashed_id = ?)   " +
            "  WHERE f.account_id = ? ";
        if(err){
            console.log(err);
        }
        if(row) {
            if(row.length>0) {
                mysql.executeSql(query, [sn,type,vid ,userid], function (err, row) {
                    if (err) {
                        console.log(err);
                    }
                    callback(null, row);
                });
            }else{
                callback(null, null);
            }
        }else{
            callback(null, null);
        }
    })
}
//查询直播分享数据
Friend.getQeryShare = function(type,userid,sn,callback){
    var query = "SELECT id FROM t_device WHERE deviceSN = ? AND accountID=? LIMIT 1";
    mysql.executeSql(query,[sn,userid],function(err,row) {
        query = "SELECT a.id,a.`accountName`,(CASE WHEN v.`share_device_SN` IS NULL THEN 0 ELSE CASE WHEN v.state = ? THEN 1 ELSE 0 END END) AS type ,v.hashed_id AS hashedid FROM t_account a JOIN t_friends f ON  a.id = f.rel_account_id "
            + " LEFT JOIN t_video_source v ON a.`id` = v.`account_id` AND( v.share_device_SN = ? AND v.`enable` = 'Yes'AND v.state = ? )   " +
            "  WHERE f.account_id = ? ";
        if(err){
            console.log(err);
        }
        if(row) {
            if(row.length>0) {
                mysql.executeSql(query, [type,sn,type, userid], function (err, row) {
                    if (err) {
                        console.log(err);
                    }
                    callback(null, row);
                });
            }else{
                callback(null, null);
            }
        }else{
            callback(null, null);
        }
    })
}

//某个用户下可看直播源
Friend.getVideoSource = function(userid,id,callback){
    var query="SELECT vs.share_device_SN share_device_SN,dvc.accountName share_account_name,dvc.deviceType share_device_type,"+
        " dvc.deviceName share_device_Name,v.hashed_id hashed_id FROM t_video_source  vs LEFT JOIN t_device dvc"+
        " ON dvc.deviceSN=vs.share_device_SN LEFT JOIN t_video v ON v.author=vs.share_device_SN AND v.type=0"+
        " AND v.tag='output_flv_live_only' WHERE vs.account_id=? AND vs.state = '1'  AND vs.`enable`='Yes' " +
        "AND vs.`share_device_SN` IN (SELECT deviceSN FROM `t_device` WHERE accountID = ?) " +
        "ORDER BY vs.share_device_sn";
    mysql.executeSql(
        query,
        [userid,id],
        function(err, rows) {
            if (err){
                callback(err)
                //throw err;
            }
            callback(null,rows);
        }
    );
};
Friend.getRecordSource = function(userid,accountID,callback){
    var query =
        " SELECT DISTINCT a.deviceSN,a.deviceName,deviceType,a.accountID,a.accountName,b.hashed_id,b.url,b.size,b.id,FROM_UNIXTIME(b.created_at) AS created_at,b.duration,b.file_name,b.input_bytes,"+
        " (SELECT MAX(url) FROM t_thumbnails t WHERE t.hashed_id=b.hashed_id) photourl,b.remark  FROM t_video_source vs"+
        " LEFT JOIN t_device a ON a.deviceSN=vs.share_device_SN"+
        " RIGHT JOIN t_video b ON b.author=vs.share_device_SN AND b.status='0' AND b.type = '2' AND  vs.`hashed_id` = b.`id`"+
        " WHERE vs.account_id=? AND vs.`enable` ='Yes' AND vs.`state` = '3' "+
        "  AND vs.`share_device_SN` IN (SELECT deviceSN FROM `t_device` WHERE accountID = ?)"+
        "ORDER BY created_at DESC";
    var param=[userid,accountID];
    mysql.executeSql(query,param,function(err, rows) {
            if (err){
                callback(err)
            }
            callback(null,rows);
        }
    );

};
Friend.deleteVideoShare = function(id,callback){
    var query ="DELETE FROM t_video_source WHERE id = ?";
    mysql.executeSql(query,[id],function(err, rows) {
            if (err){
                callback(err)
            }
            callback(null,rows);
        }
    );
}

Friend.delete = function(id,rid,userid,callback){
    var query ="DELETE FROM t_friends WHERE id = ?";
    mysql.executeSql(query,[id],function(err, rows) {
            if (err){
                callback(err)
            }
            if(rows){
                query  = "SELECT deviceSN FROM t_device WHERE accountID = ?";
                mysql.executeSql(query,[userid],function(err,devices){
                    if(err){
                        callback(err)
                    }
                    if(devices){
                        query="DELETE FROM t_video_source WHERE account_id = ? AND share_device_SN = ?";
                        mysql.executeSql(query,[rid,devices[0].deviceSN],function (err,vs){
                            if(err){
                                callback(err)
                            }
                            callback(null,rows);
                        })
                    }
                })
            }
        }
    );
}
