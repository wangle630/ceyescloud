var mysql=require("../public/javascripts/mysql/mysql.js");

function User(id,name,password,email,default_group_id,space,Created,Updated){
    this.id = id;
    this.accountName = name;
    this.Password = password;
    this.email = email;
    this.default_group_id = default_group_id;
    this.space = space;
    this.Created = Created;
    this.Updated = Updated;
}

module.exports = User;

//所有用户注册用户信息
User.getAll = function(callback){
    var query = "SELECT * FROM t_account " +  //获取用户信息
        "WHERE default_group_id=? " +
        "ORDER BY Created DESC";
    var param=[default_group_id];
    var default_group_id = 1;
    mysql.executeSql(query,param,function(err, rows) {
            if (err){
                callback(err)
            }
            callback(null,rows);
        }
    );
};

//通过用户名取得用户信息
User.getOne = function(name,callback){
    var query = "SELECT * FROM t_account " +  //获取用户信息
        "WHERE accountName=? " +
        "limit 1";
    var param=[name];
    mysql.executeSql(query,param,function(err, row) {
            if (err) console.log(err);
            callback(null,row);
        }
    );
};

//通过用户名取得用户信息 + 存储空间
User.getOnePlus = function(name,callback){
    var query1 = "SELECT * FROM t_account " +  //获取用户信息
        "WHERE BINARY accountName=? " +
        "limit 1";
    var param1=[name];
    mysql.executeSql(query1,param1,function(err, row) {
            if (err){
                console.log(err);
            }
            callback(null,row);
            //var query2 = "SELECT sum(input_bytes) as bytes FROM remote_guide.t_device a   join remote_guide.t_video b " +
            //    "on a.deviceSN = b.author " +
            //    "where a.enable = 'Yes' and b.status='0' and b.type = '2' and a.accountID=?" +
            //    "ORDER BY created_at ASC";
            //var param2=[row[0].id];
            //mysql.executeSql(query2,param2,function(err, space) {
            //        if (err){
            //            throw err;
            //        }
            //
            //    }
            //);
        }
    );
};
User.getUserSpace = function(name,callback){
    var query = "SELECT sum(input_bytes) as bytes FROM remote_guide.t_device a   join remote_guide.t_video b " +
        "on a.deviceSN = b.author " +
        "where a.enable = 'Yes' and b.status='0' and b.type = '2' and a.accountID=?" +
        "ORDER BY created_at ASC";
    var param=[name];
    mysql.executeSql(query,param,function(err, row) {
            if (err){
                throw err;
            }
            callback(null,row);
        }
    );
};
User.updatePwd = function(param,callback){
    var query = "UPDATE t_account  SET PASSWORD=?  WHERE id=?";
    mysql.executeSql(query,param,function(err, row) {
            if (err){
                throw err;
            }
            callback(null,row);
        }
    );
};


//新增注册用户信息
User.prototype.save = function(callback){
    //存入数据库的内容
    var User ={
        id : this.id,
        name : this.accountName,
        password : this.Password,
        email : this.email,
        default_group_id: '1',
        space:'',
        Created:this.Created,
        Updated:this.Updated,
        accountType:'Person'
    };
    var query = "INSERT INTO t_account (id,accountName,Password,email,default_group_id,Created,Updated,accountType) " +
        " VALUES (?, ?, ?, ?, ?, ?, ?,?)" ;
    var param=[User.id, User.name,User.password,User.email,User.default_group_id,User.Created,User.Updated,User.accountType];
    mysql.executeSql(query,param,function(err,vals) {
            if (err){
                console.log(err);
                callback(err);
            }
            callback(null,vals)
        }
    );
};
User.existsName = function(param,callback){
    var query1 = "SELECT accountName FROM t_account  WHERE accountName=?";
    mysql.executeSql(query1,param,function(err, row) {
            if (err){
                console.log(err);
            }
            callback(null,row);
        }
    );
};
User.existsEmail = function(param,callback){
    var query1 = "SELECT email FROM t_account  WHERE email=?";
    mysql.executeSql(query1,param,function(err, row) {
            if (err){
                console.log(err);
            }
            callback(null,row);
        }
    );
};
//查看全部好友
User.getFriend = function(userid,callback){
    var query = "SELECT f.id as fid,f.rel_account_id,a.* FROM t_account a join t_friends f on  a.id = f.rel_account_id " +
        "WHERE f.account_id = ?"
    mysql.executeSql(query,[userid],function(err, row) {
            if (err){
                console.log(err);
            }
            callback(null,row);
        }
    );
}

User.getRecordSource = function(userid,callback) {
    var query =
        " SELECT DISTINCT a.deviceSN,a.deviceName,deviceType,a.accountID,a.accountName,b.hashed_id,b.url,b.size,b.id,FROM_UNIXTIME(b.created_at) AS created_at,b.duration,b.file_name,b.input_bytes," +
        " (SELECT MAX(url) FROM t_thumbnails t WHERE t.hashed_id=b.hashed_id) photourl,vs.account_name name,vs.`id`as vsid FROM t_video_source vs" +
        " LEFT JOIN t_device a ON a.deviceSN=vs.share_device_SN" +
        " RIGHT JOIN t_video b ON b.author=vs.share_device_SN AND b.status='0' AND b.type = '2' AND  vs.`hashed_id` = b.`id`" +
        " WHERE  vs.`enable` ='Yes' AND vs.`state` = '3' " +
        "  AND vs.`share_device_SN` IN (SELECT deviceSN FROM `t_device` WHERE accountID = ?)" +
        "ORDER BY created_at DESC";
    var param = [userid];
    mysql.executeSql(query, param, function (err, rows) {
            if (err) {
                callback(err)
            }
            callback(null, rows);
        }
    );
}

User.getVideoSource = function(userid,callback){
    var query="SELECT vs.share_device_SN share_device_SN,dvc.accountName share_account_name,dvc.deviceType share_device_type,"+
        " dvc.deviceName share_device_Name,v.hashed_id hashed_id,vs.account_name name,vs.`id`as vsid FROM t_video_source  vs LEFT JOIN t_device dvc"+
        " ON dvc.deviceSN=vs.share_device_SN LEFT JOIN t_video v ON v.author=vs.share_device_SN AND v.type=0"+
        " AND v.tag='output_flv_live_only' WHERE  vs.state = '1'  AND vs.`enable`='Yes' " +
        "AND vs.`share_device_SN` IN (SELECT deviceSN FROM `t_device` WHERE accountID = ?) " +
        "ORDER BY vs.share_device_sn";
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
