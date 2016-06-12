var mysql=require("../public/javascripts/mysql/mysql.js");

function Record(deviceSN,deviceName,accountID,accountName,deviceType,id,url,size,duration,created_at,duration,file_name,input_bytes){
    this.deviceSN = deviceSN;
    this.deviceName =deviceName;
    this.deviceType =deviceType;
    this.accountID = accountID;
    this.accountName = accountName;
    this.id = id;
    this.url = url;
    this.size = size;
    this.created_at = created_at;
    this.duration = duration;
    this.file_name = file_name;
    this.input_bytes = input_bytes;
}

module.exports = Record;

Record.getPlayLog = function(accountID,callback){
    var query = "SELECT  *  FROM t_play_log " +
        "where accoundid=? " +
        "ORDER BY Updated DESC ";
    mysql.executeSql(
        query,
        [accountID],
        function(err, rows) {
            if (err){
                throw err;
            }
            callback(null,rows);
        }
    );
}

Record.getLiveList = function(callback){
    var query = "SELECT author,url,size FROM t_video where type = 0"
    mysql.executeSql(
        query,
        function(err, rows) {
            if (err){
                throw err;
            }
            console.log(rows)
            callback(null,rows);
        }
    );
}




Record.getIshashed = function(accountId,hashedid,callback){
    var query = "SELECT COUNT(DISTINCT a.deviceSN,b.id) as count" +
        " FROM t_video b "+
        " RIGHT JOIN t_video_source vs ON b.author = vs.`share_device_SN`  AND vs.`enable`='yes' AND (CASE WHEN vs.`state`='3' THEN vs.`hashed_id` = b.`id` ELSE 1=1 END ) "+
        " JOIN t_device a ON a.deviceSN=vs.share_device_SN "+
        " WHERE vs.account_id=? AND b.hashed_id = ? AND vs.`enable` ='Yes' AND b.size<>'0x0' AND  b.type = '2' AND b.status=0  AND b.url LIKE '%.mp4' ";


    var param=[accountId,hashedid];
    mysql.executeSql(query,param,function(err, rows) {
            if (err){
                callback(err)
            }
            callback(null,rows);
        }
    );
}
Record.getVideoSourceCount = function(accountId,status,username,callback){
    var query = "SELECT COUNT(DISTINCT a.deviceSN,b.id) as count" +
        " FROM t_video b "+
        " RIGHT JOIN t_video_source vs ON b.author = vs.`share_device_SN`  AND vs.`enable`='yes' AND (CASE WHEN vs.`state`='3' THEN vs.`hashed_id` = b.`id` ELSE 1=1 END ) "+
        " JOIN t_device a ON a.deviceSN=vs.share_device_SN "+
        " WHERE vs.account_id=? AND vs.`enable` ='Yes' AND b.size<>'0x0' AND  b.type = '2' AND b.status=0  AND b.url LIKE '%.mp4' ";

    if(status == 0){
        query+=  "AND (vs.`state` = '3' OR vs.`state`='0') "+
            " ORDER BY created_at DESC";
    }
    if(status == 1){
        query+=  "AND ( vs.`state`='0') "+
            " ORDER BY created_at DESC";
    }
    if(status == 2){
        query+=  "AND ( vs.`state`='3') "+
            " ORDER BY created_at DESC";
    }
    if(status == 3){
        query+=  " AND (vs.`state` = '3' OR vs.`state`='0') AND  ( b.`opaque` LIKE '%\"source\":0}') "+
            " ORDER BY created_at DESC";
    }
    var param=[accountId];
    mysql.executeSql(query,param,function(err, rows) {
            if (err){
                callback(err)
            }
            callback(null,rows);
        }
    );
}
//某个用户下所有历史记录
Record.getVideoSource = function(accountID,pageNow,pageSize,status,username,callback){
    var query = "SELECT a.*,t.url as photourl FROM ("+
        " SELECT DISTINCT a.deviceSN,a.deviceName,deviceType,a.accountID,a.accountName,b.hashed_id,b.url,b.size,b.id,FROM_UNIXTIME(b.created_at) AS created_at,b.duration,b.file_name,b.input_bytes,"+
        " (SELECT MAX(url) FROM t_thumbnails t WHERE t.hashed_id=b.hashed_id) photourl,vs.state AS state,b.remark remark " +
        " FROM t_video b "+
        " RIGHT JOIN t_video_source vs ON b.author = vs.`share_device_SN` AND vs.`enable`='yes' AND (CASE WHEN vs.`state`='3' THEN vs.`hashed_id` = b.`id` ELSE 1=1 END ) "+
        " JOIN t_device a ON a.deviceSN=vs.share_device_SN "+
        " WHERE vs.account_id=? AND vs.`enable` ='Yes' AND b.size<>'0x0' AND  b.type = '2' AND b.status=0   AND b.url LIKE '%.mp4'";
    if(status == 0){
        query+=  "AND (vs.`state` = '3' OR vs.`state`='0') "+
            " ORDER BY created_at DESC LIMIT ?,?)a";
    }
    if(status == 1){
        query+=  "AND ( vs.`state`='0') "+
            " ORDER BY created_at DESC LIMIT ?,?)a";
    }
    if(status == 2){
        query+=  "AND ( vs.`state`='3') "+
            " ORDER BY created_at DESC LIMIT ?,?)a";
    }
    if(status == 3){
        query+=  " AND (vs.`state` = '3' OR vs.`state`='0') AND  ( b.`opaque` LIKE '%\"source\":0}')   "+
            " ORDER BY created_at DESC LIMIT ?,?)a";
    }
    query+=" LEFT JOIN (SELECT DISTINCT(hashed_id),url,MAX(id) FROM  t_thumbnails GROUP BY hashed_id ) t ON t.`hashed_id` = a.hashed_id"
    var param=[accountID,(pageNow-1)*pageSize,pageSize];
    mysql.executeSql(query,param,function(err, rows) {
            if (err){
                callback(err)
            }
            callback(null,rows);
        }
    );
};

Record.play_record = function(param,callback){
    var sql="SELECT  id,type,hashed_id,author,url,svod_url,size,FROM_UNIXTIME(created_at) as created_at,duration,finished_at,format,vs_id,private_flag,ctype,cversion,"+
        " service_code,is_resume,tag,opaque,live_only,file_name,session_duration,disconnect_reason,reach_end,http_output_bytes,input_bytes,output_idx,path,username,status "+
        "  FROM t_video WHERE hashed_id=?  AND TYPE =2";
    mysql.executeSql(sql,param,function(err, rows) {
            if (err){
                throw err;
            }
            callback(null,rows);
        }
    );
}

Record.saveLog = function(logid,randomid,accoundid,accoundName,hashed_id,size,duration,palyedRange,buffRange,Updated,callback){
    var query = "DELETE FROM t_play_log " +
        "where id=?" ;
    var param=[logid];
    mysql.executeSql(query,param,function(err, rows) {
            if (err){
                throw err;
            }
            var query2 = "INSERT INTO t_play_log (id,randomid,accoundid,accoundName,hashed_id,size,duration,palyedRange,buffRange,Updated) " +
                " VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)" ;
            var param2=[logid,randomid,accoundid,accoundName,hashed_id,size,duration,palyedRange,buffRange,Updated];
            mysql.executeSql(query2,param2,function(err, rows) {
                    if (err) {
                        throw err;
                    }
                    callback(null, rows);
                }
            )
        }
    );
};

Record.delete =function(param1,param2,callback){
    console.error('--------Record.delete START -----------');
    console.error('param1 :' + param1);
    console.error('param2 :' + param2);
    console.error('--------Record.delete END-----------');
    var query1='UPDATE t_device SET useStorage=useStorage-(SELECT input_bytes/1024/1024 FROM t_video WHERE hashed_id=? AND TYPE=2 AND status = 0 LIMIT 1)  WHERE deviceSN=? ';
    var query2="UPDATE t_video SET STATUS=1 WHERE hashed_id=? AND TYPE =2 ";

    mysql.conn.beginTransaction(function (err) {
            if (err) {
                throw err;
                console.log(err);
            }
            mysql.conn.query(query1,param1,function(err,rows) {
                    if (err){
                        return mysql.conn.rollback(function () {
                            console.log('first update t_device');
                            throw err;
                        });
                        callback(err)
                    }
                    mysql.conn.query(query2,param2,function (err,rows) {
                            if (err) {
                                console.log('second update t_video');
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
        }
    )
}
