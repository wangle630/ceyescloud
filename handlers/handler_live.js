var mysql=require("../public/javascripts/mysql/mysql.js");
var Device = require('../module/module_device');
var http = require('http');
var url=require('url');
var schedule = require('node-schedule');
var config=require("../config.js");
var BASE_URL = config.BASE_URL;
var uri_txt = config.uri_txt;
var uri_audio = config.uri_audio;
var uri_task= config.uri_task;
var CryptoJS = require("crypto-js");

if(config.locate=="server") {
    var rule = new schedule.RecurrenceRule();
    var times = [0, 30];
    rule.second = times;
    var j = schedule.scheduleJob(rule, function () {
        console.log(new Date());
        var sql = "SELECT *  FROM t_video WHERE TYPE=0 LIMIT 1";
        mysql.executeSqlNoParam(sql, function (err, vals) {
            if (err) {
                throw err;
            }
            if (vals) {
                if (vals.length > 0) {
                    console.log('>>>>');
                    videoStatus();
                }
            }
        });
    });
}

function videoStatus (){
    var http = require('http');
    var querystring=require("querystring");
    var query_str = 'service_code='+ config.SERVICE_CODE;
    var now = new Date().getTime().toString();
    var signature = make_signature(uri_task, query_str, now,config.API_KEY).toString();

    var opt={
        hostname:url.parse(BASE_URL).hostname,
        path:uri_task+'?'+query_str ,
        method:'GET',
        crossDomain: true,
        headers:{
            'xvs-timestamp' : now, 'xvs-signature': signature
        }
    };

    var body = '';
    //发送请求
    var requ = http.request(opt, function(reso){
        reso.on('data', function(d){
            body += d;
        });
        reso.on('end',function(){
            console.log(body)
            getDataFromTasklisk(JSON.parse(body));
            //res.end(body);
        });
    });
    //请求本身失败
    requ.on('error', function(e) {
        console.log(e.message);
    });
    requ.end();
}
var tasks="";

function getDataFromTasklisk(data) {
    if (parseInt(data.ret)) {
        console.error('获取直播列表失败 ret=' + data.ret);
        return;
    }
    tasks=config.SERVICE_CODE=='DKTSFKUQ'?data.list:data.task_list;
    if (0 == tasks.length) {
        var sql = "UPDATE t_video SET TYPE=10  WHERE TYPE=0 ";
        mysql.executeSqlNoParam(sql,function(err,vals){
            if (err) {
                throw err;
            }
            if(vals) {
                console.log('=0  succ');
            }
        });
    } else {
        console.log('begin');
        var ids = getIds(data);
        //使用param方式，会更改全部，所以改成直接写sql
        console.log(ids);
        var sql = "UPDATE t_video SET TYPE=10 WHERE hashed_id NOT IN ("+ids+") AND TYPE=0  ";
        console.log(sql);
        mysql.executeSqlNoParam(sql, function (err, vals) {
            if (err) {
                throw err;
                console.error(err);
            }
            if (vals) {
                console.log('!=0   succ');
            }
        });
    }
}
function getIds(data) {
    var ids = "";
    for (var i = 0; i < tasks.length; i++) {
        var id=config.SERVICE_CODE=='DKTSFKUQ'?tasks[i].task_id:tasks[i].id;
        ids += "'" + id + "',";
    }
    if ("" != ids) {
        ids=ids.substring(0, ids.length - 1);
    }
    console.log(ids);
    return ids;
}
exports.RecorderInit=function(req,res){
    var query_string = "";
    var action_url = "";
    var signature = null;
    var now = null;
    var author=req.query.author;
    var vs_id=req.query.vs_id;
    var action_url=null;
    if ('' == author) {
        action_url = '';
    } else {
        query_string += "dst_username=" + author + "&vs_id=" + vs_id + "&service_code="+config.SERVICE_CODE;
        now = new Date().getTime().toString();
        signature = make_signature(uri_audio, query_string, now, config.API_KEY).toString();
        action_url = uri_audio + "?" + query_string;
        var url_audio_all=BASE_URL+action_url;
        var result='FWRecorder.recorder.init("'+url_audio_all+'", "upload_file[filename]", $("#uploadForm").serializeArray(), "'+signature+'", '+now+');';
        res.send(result);
    }
}
exports.mylives = function(req,res){
    userid = req.session.user.id;
    Device.getVideoSource(userid,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/mydevices');
        }
        if(rows){
            res.render('mylives',{
                title:'可看直播',
                rows:rows,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        }
    })
}
exports.refreshMylives = function(req,res){
    var user = req.session.user;
    if(null != user) {
        Device.getLookDeviceSn(user.id, function (err, rows) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/mydevices');
            }
            if (rows) {
                res.send(rows);
            }
        })
    }
}
exports.remoteadvice = function(req,res){
    var userid = req.session.user.id;
    var deviceSN=req.params.share_device_SN;
    var user = req.session.user;
    var page="remoteadvice";
    var is_ios = /(iPhone|iPod|iPad).*AppleWebKit.*Safari/i.test(req.headers["user-agent"]);
    if(is_ios){
        page="remoteadviceIOS";
    }
    var sql=" SELECT DISTINCT url,author,vs_id,v.hashed_id,vs.state,v.size FROM t_video  v,t_video_source vs WHERE v.type=0 AND  v.author=?  AND account_id=?  AND vs.share_device_SN=v.author  "+
        " AND  (state=0 OR state=1 OR state=2)   ORDER BY created_at DESC ";
    var param=[deviceSN,userid];
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        if(vals) {
            if(vals.length>0){
                var rtmpUrl="",flvUrl="",m3u8Url="";
                for(var i=0; i < vals.length; i++) {
                    var url=vals[i].url;
                    if(url.indexOf("rtmp")===0){
                        rtmpUrl=url;
                        console.log('rtmp:'+url);
                    }else if(url.lastIndexOf(".flv")==(url.length-4)){
                        flvUrl=url;
                        console.log('flv:'+url);
                    }else if(url.lastIndexOf(".m3u8")==(url.length-5)){
                        m3u8Url=url;
                        console.log('m3u8:'+url);
                    }
                }
                //var url=vals[0].url;
                var author=vals[0].author;
                var vs_id=vals[0].vs_id;
                var hashed_id=vals[0].hashed_id;
                var state=vals[0].state;
                var size=vals[0].size;
                var opaque = '{"player_user":"'+author+'","hashed_id":"'+hashed_id+'","recordUser":"'+userid+'"}';
                var rtpmInit="rtmp_publisher.connect('rtmp://"+config.uri_rtmp+":1934/live','"+author+"', '"+user.id+"', '"+config.SERVICE_CODE+"', null, '"+opaque+"');";
                res.render(page,{
                    title:'远程指导',
                    hashed_id:hashed_id,
                    rtmpUrl:rtmpUrl,
                    flvUrl:flvUrl,
                    m3u8Url:m3u8Url,
                    state:state,
                    deviceSN:deviceSN,
                    vs_id:vs_id,
                    author:author,
                    rtpmInit:rtpmInit,
                    user:req.session.user,
                    size:size,
                    success:req.flash('success').toString(),
                    error:req.flash('error').toString()
                });
            }else{
                req.flash('error', '当前设备无可看直播或您无权观看此次直播');
                return res.redirect('/mylives');
            }
        }
    });
}
function getAction(action){
    var result='';
    if('1'==action){
        result="show_msg";
    }else if ('2'==action){
        result="draw_rect";
    }
    return result;
}
exports.sendTxtMessage = function(req,res){
    var text=req.query.content;
    var author=req.query.author;
    var actionReq=req.query.action;
    var actionRst=getAction(actionReq);
    var http = require('http');
    var querystring=require("querystring");
    var accountName = req.session.user.accountName;
    var msg='{"cmd":"'+actionRst+'", "params": ['+text+']}';
    console.log(msg);
    var from_username='002';
    var query_str = 'service_code='+ config.SERVICE_CODE;
    query_str += "&dst_username=" + author;
    query_str += "&message=" + msg;
    query_str += "&from_username=" + accountName;
    var now = new Date().getTime().toString();
    //signature的msg必须用转义前的命令，否则签名失败
    var signature = make_signature(uri_txt, query_str, now, config.API_KEY).toString();
    var escape=querystring.escape(msg);
    //发送请求时必须用转义后，否则发送失败
    query_str = 'service_code='+ config.SERVICE_CODE;
    query_str += "&dst_username=" + author;
    query_str += "&message=" + escape;
    query_str += "&from_username=" + accountName;
    var opt={
        hostname:url.parse(BASE_URL).hostname,
        path:uri_txt+'?'+query_str ,
        method:'GET',
        crossDomain: true,
        headers:{
            'xvs-timestamp' : now, 'xvs-signature': signature
        }
    };
    var body = '';
    //发送请求
    var requ = http.request(opt, function(reso){
        reso.on('data', function(d){
            body += d;
            console.log(body);
        });
        reso.on('end',function(){
            console.log(body)
            res.end(body);
        });
    });
    //请求本身失败
    requ.on('error', function(e) {
        console.log(e.message);
    });
    requ.end();
}
function make_signature(uri, query_string, now, key) {
    var data = uri + query_string + now;
    var result=CryptoJS.HmacSHA256(data, key);
    return result;
}