/**
 * Created by liyan on 2016/3/1.
 * 提供接口供客户端使用
 */
/**
 * 绑定设备信息接口(username,password，videoFrameRate, videoCodec,videoBitRate,videoFrameWidth,videoFrameHeight),post sn 给服务器  码率返回的单位为M，比如返回2，代表2M码率
 * 思路：在绑定设备时，向设备表里插入一条进入，保存设备的硬件信息
 * 再在t_account表插入一条记录，账号是用户+设备sn
 * @param req
 * @param res
 * @constructor
 */
var Interface = require('../module/module_interface');
var url = require('url');
exports.BindDevices = function(req,res) {
    var body = req.body;
    var sn = body.sn;
    var timestamp=body.time;
    var userid=body.userid;
    var param = [sn,timestamp,userid];
    //Interface.GetCountByIdTypeFormat(param, function (err, vals) {
    //    if (err) {
    //        throw err;
    //        res.send(err);
    //    }
    //    if (vals) {
    //        var count = vals[0].count;
    //        if (count == '0') {
    //
                res.send('{"ret":0}');
    //            console.log('RecordStart 0');
    //
    //        }
    //    }
    //});
}
/**
 * 判断用户是否可用（返回0表示可用/1表示不可用）post username
 * 根据usename在t_devices表查出此设备是否可用，enable字段
 * @param req
 * @param res
 * @constructor
 */
exports.UserEnable = function(req,res) {
    var body = req.body;
    var username = body.username;
    var param = [username];
    //Callback.GetCountByIdTypeFormat(param, function (err, vals) {
    //    if (err) {
    //        throw err;
    //        res.send(err);
    //    }
    //    if (vals) {
    //        var count = vals[0].count;
    //        if (count == '0') {
    //
                res.send('{"ret":0}');
    //            console.log('RecordStart 0');
    //
    //        }
    //    }
    //});
}
/**
 * 判断本地apk是否为最新版本（versionCode,downloadUrl）post sn
 * （返回服务器端最新的apk的版本以及下载地址），本地采取自动下载，静默安装
 * @param req
 * @param res
 * @constructor
 */
exports.GetApkInfo = function(req,res) {
    var body = req.body;
    var sn = body.sn;
    var param = [sn];
    //Callback.GetCountByIdTypeFormat(param, function (err, vals) {
    //    if (err) {
    //        throw err;
    //        res.send(err);
    //    }
    //    if (vals) {
    //        var count = vals[0].count;
    //        if (count == '0') {
    //
                res.send('{"ret":0}');
    //            console.log('RecordStart 0');
    //
    //        }
    //    }
    //});
}
/**
 * 判断配置文件是否为最新(timestamp,username,password，videoFrameRate, videoCodec,videoBitRate,videoFrameWidth,videoFrameHeight) post sn
 （服务器返回配置详细信息以及时间戳）
 * @param req
 * @param res
 * @constructor
 */
exports.GetConfigInfo = function(req,res) {
    var body = req.body;
    var sn = body.sn;
    var param = [sn];
    if(sn==null || sn.length<=0){
        res.send('{"ret":1}');
        return;
    }
    Interface.GetConfigInfo(param, function (err, vals) {
        if (err) {
            throw err;
            res.send('{"ret":10000}');
        }
        if (vals) {
            res.json(vals);
            console.log('RecordStart 0');
        }
    });
}
/**
 * 获取wifi信息接口（type,ssid,password，wifitype)
 * @param req
 * @param res
 * @constructor
 */
exports.GetWifiInfo = function(req,res) {
    var body = req.body;
    var sn = body.sn;
    var param = [sn];
    //Callback.GetCountByIdTypeFormat(param, function (err, vals) {
    //    if (err) {
    //        throw err;
    //        res.send(err);
    //    }
    //    if (vals) {
    //        var count = vals[0].count;
    //        if (count == '0') {
    //
                res.send('{"ret":0}');
    //            console.log('RecordStart 0');
    //
    //        }
    //    }
    //});
}
/**
 * 获取用户存储空间（网络硬盘 当前已用/总共空间）
 * @param req
 * @param res
 * @constructor
 */
exports.GetStorageInfo = function(req,res) {
    var body = req.body;
    var sn = body.sn;
    var param = [sn];
    //Callback.GetCountByIdTypeFormat(param, function (err, vals) {
    //    if (err) {
    //        throw err;
    //        res.send(err);
    //    }
    //    if (vals) {
    //        var count = vals[0].count;
    //        if (count == '0') {
    //
                res.send('{"ret":0}');
    //            console.log('RecordStart 0');
    //
    //        }
    //    }
    //});
}