var url = require('url');
var crypto = require('crypto');
var Callback = require('../module/module_callback');
var config=require("../config.js");
var AUTHRN_MODE_CHALLENGE='3';

exports.Auth = function(req,res) {
    var arg = url.parse(req.url, true).query;
    var username = arg.username;
    var challenge = arg.challenge;
    var response = arg.response;
    var service_code = arg.service_code;
    var authen_mode = arg.authen_mode;
    var password = '';
    console.log('username:'+username);
    console.log('challenge:'+challenge);
    console.log('response:'+response);
    console.log('service_code:'+service_code);
    if (AUTHRN_MODE_CHALLENGE == authen_mode && config.SERVICE_CODE == service_code) {
        Callback.Auth(username, function (err, vals) {
            if (err) {
                res.send(err);
            }
            if (!vals || vals.length == 0) {
                res.send('{"ret": -1}');
                console.log('Auth -1');
            } else {
                password = vals[0].accountID;
                if (password==null||typeof(password) == "undefined" || password.length <= 0) {
                    res.send('{"ret": 10003}');
                    console.log('Auth 0');
                } else {
                    var result = calculate_challenge_response(challenge, password);
                    if (result == response) {
                        res.send('{"ret": 0}');
                        console.log('Auth 0');
                    }else{
                        res.send('{"ret": -1}');
                        console.log('Auth -1');
                    }
                }
            }
        });
    }
}

/**
 0RecordStart:
 a.有：不操作
 b.无：insert
 */
exports.RecordStart = function(req,res){
    var body=req.body;
    var hashed_id=body.hashed_id;
    var type=body.type;
    var format=body.format;
    var param=[hashed_id,type,format];
    Callback.GetCountByIdTypeFormat(param,function(err,vals){
        if(err){
            throw err;
            res.send(err);
        }
        if(vals) {
            var count = vals[0].count;
            if (count == '0') {
                //日本服务器url是127.0.01，特殊处理
                var url=config.SERVICE_CODE=='DKTSFKUQ'?body.url.replace(/127.0.0.1/, '52.196.117.35'):body.url;
                var param = [body.type, body.hashed_id, body.author,url, body.svod_url, body.size, body.created_at, body.duration, body.format, body.vs_id, body.path,
                    body.private_flag, body.ctype, body.cversion, body.service_code, body.is_resume, body.tag, body.opaque, body.live_only, 0];
                Callback.RecordStart_Insert(param,function(err,vals){
                    if (err) {
                        throw err;
                        res.send(err);
                    }
                    if (vals) {
                        res.send('{"ret":0}');
                        console.log('RecordStart 0');
                    }
                });
            }
        }
    });
}
/**
 1：
 a.判断是否有0：有(0210)；无（不操作）
 b.判断是否有1：有(不操作);无(insert)
 */
exports.RecordStop = function(req,res) {
    var para=req.body;
    var param=['10',para.hashed_id,'0'];
    Callback.UpdateTypeByHashed_id(param,function(err,vals){
        if (err) {
            throw err;
            res.send(err);
        }
        if(vals){
            var date = new Date(para.created_at * 1000 );
            var finished_at =new Date(date.getTime()+para.duration*1000);

            var param=[para.type,para.hashed_id,para.vs_id,para.service_code,para.created_at,para.reach_end,
                para.is_resume,para.tag,para.http_output_bytes,para.input_bytes,para.duration,para.format,para.output_idx,
                para.opaque,para.live_only,0,finished_at];
            Callback.RecordStop_Insert(param,function(err,vals){
                if (err) {
                    throw err;
                }
                if(vals){
                    res.send('{"ret":0}');
                    console.log('RecordStop 0');
                }
            });
        }
    });
}
/**
 2:
 a.0:有(0210)；无（不操作）
 b.2:有(不操作);无(insert);
 */
exports.SaveVideo = function(req,res) {
    var para=req.body;
    var date = new Date(para.created_at * 1000 );
    var finished_at =new Date(date.getTime()+para.duration*1000);
    var param1=['10',para.hashed_id,'0'];
    var param2=[para.hashed_id,para.type];
    var param3=[para.type,para.hashed_id,para.author,para.size,para.created_at,para.duration,
        para.format,para.vs_id,para.path,para.file_name,para.private_flag,para.ctype,
        para.cversion,para.service_code,para.is_resume,para.tag,para.http_output_bytes,
        para.input_bytes,para.output_idx,para.opaque,para.live_only,para.url,0,finished_at];
    var storage=para.input_bytes/1024/1024;
    var param4=[storage,para.author];
    Callback.SaveVideo(param1,param2,param3,param4,function(err,vals){
        if (err) {
            throw err;
        }
        if(vals) {
            res.send('{"ret":0}');
            console.log('SaveVideo 0');
        }
    });
}
/**
 * 用户下线
 * @param req
 * @param res
 * @constructor
 */
exports.UserOffline = function(req,res) {
    var para=req.body;
    var param=[para.type,para.username,para.service_code,para.session_duration,para.disconnect_reason,para.vs_id,0];
    Callback.UserOffline_Insert(param,function(err,vals){
        if (err) {
            throw err;
        }
        if(vals){
            res.send('{"ret":0}');
            console.log('UserOffline 0');
        }
    });

}
/**
 * 生成缩略图
 * @param req
 * @param res
 * @constructor
 */
exports.ThumbnailsCreate = function(req,res) {
    var para=req.body;
    var param=[para.type,para.hashed_id,para.vs_id,para.service_code,para.path,
        para.file_name,para.width,para.height,para.opaque,para.live_only,para.url];
    Callback.ThumbnailsCreate_Insert(param,function(err,vals){
        if (err) {
            throw err;
        }
        if(vals){
            res.send('{"ret":0}');
            console.log('ThumbnailsCreate 0');
        }
    });

}

/**
 * 直播恢复通知
 * @param req
 * @param res
 * @constructor
 * type=15, username, service_code， hashed_id, status

 字段status在直播恢复回调中的含义：

 status = 0 表示发现客户端异常断线，等待重连。 status = 1 表示客户端重连成功，直播恢复成功。
 */
exports.RecordRecovery= function(req,res){
    var para=req.body;
    var path=req.url.path;
    console.log('path:'+path);
    var param=[para.type,para.username,para.service_code,para.hashed_id,para.status];
    console.log('param'+param);
}
function calculate_challenge_response(challenge, password) {
    var md5_signer = crypto.createHash('md5');
    md5_signer.update(password);
    var hashed_pass = md5_signer.digest();
    md5_signer = crypto.createHash('md5');
    md5_signer.update(hashed_pass);
    md5_signer.update(new Buffer(challenge, 'hex'));
    return md5_signer.digest('hex');
}









