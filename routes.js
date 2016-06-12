//用户相关功能
var handler_device = require('./handlers/handler_device');
var handler_live = require('./handlers/handler_live');
var handler_record = require('./handlers/handler_record');
var handler_bill = require('./handlers/handler_bill');
var handler_order = require('./handlers/handler_order');
var handler_user = require('./handlers/handler_user');
var handler_friend = require('./handlers/handler_friend');
var handler_main = require('./handlers/handler_main');
var handler_callback = require('./handlers/handler_callback');
var handler_stream = require('./handlers/handler_stream');
//var handler_interface=require('./handlers/handler_interface');
var config =require('./config.js');
const TAG = '[SHIT]';

module.exports = function(app) {
    //－－－－－－－－－－－－－－－－－－－－通用－－－－－－－－－－－－－－－－－－－－
    //首页
    app.all('/',checkLogin);
    app.get('/', handler_main.home);
    //临时管理页面
    app.all('/',checkLogin);
    app.get('/mangament_004_jwplayerhls', handler_main.jwplayer_hls);
    app.get('/mangament_003_jwplayerrtmp', handler_main.jwplayer_rtmp);
    app.get('/mangament_002_rtmppublish', handler_main.rtmpPublish);
    app.get('/mangament_001_sumcdrs', handler_main.sum_cdrs);
    //登出
    app.all('/logout',checkLogin);
    app.get('/logout', handler_main.logout);
    //下载
    app.get('/download', handler_main.download);
    app.get('/fengtest', handler_main.fengtest);
    //－－－－－－－－－－－－－－－－－－－－设备－－－－－－－－－－－－－－－－－－－－
    //获取我的设备
    app.all('/mydevices',checkLogin);
    app.all('/mydevices/?',checkLogin);
    app.get('/mydevices', handler_device.mydevices);
    //所有设备列表
    app.get('/devicelist', handler_device.devicelist);
    //解除绑定
    app.post('/mydevices/unbind/:deviceSN', handler_device.unbind_device);
    //绑定设备
    app.post('/mydevices/bind', handler_device.bind_device);
    //重命名设备
    app.post('/mydevices/rename', handler_device.rename_device);
    //查看某一个设备的详细信息
    app.get('/mydevices/detail/:deviceid', handler_device.detail_device);
    //查看某一个设备的配置信息
    app.get('/mydevices/conf/:deviceid', handler_device.deviceconf);
    //编辑某一个设备的配置信息mediaid
    app.get('/mydevices/edit/:configid', handler_device.edit_deviceconf);
    //提交某一个设备的配置信息
    app.post('/mydevices/edit/:configid', handler_device.post_deviceconf);
    //生成绑定设备二维码内容
    app.get('/mydevices/bind_qrcode', handler_device.bind_qrcode);
    //生成连接wifi二维码内容
    app.get('/mydevices/wifi_qrcode', handler_device.wifi_qrcode);
    //生成绑定和连接wifi二维码内容
    app.get('/mydevices/bind_wifi_qrcode', handler_device.bind_wifi_qrcode);
    //生成设备配置二维码
    app.get('/mydevices/conf/qrcode/:configid', handler_device.config_qrcode);
    //客户端访问此接口获得最新设备配置信息
    app.post('/mydevices/conf/update', handler_device.config_update);
    //客户端访问此接口上传最新设备硬件信息
    app.post('/mydevices/deviceHardwareInfo',handler_device.deviceHardwareInfo);
    //客户端验证配置是否与服务器保持一致
    app.post('/mydevices/getConfigInfo',handler_device.getConfigInfo);
    //客户端判断是否被绑定
    app.post('/mydevices/getBindInfo',handler_device.getBindInfo);
    //－－－－－－－－－－－－－－－－－－－－直播－－－－－－－－－－－－－－－－－－－－
    //获取可看直播
    app.all('/mylives',checkLogin);
    app.all('/mylives/*',checkLogin);
    app.get('/mylives', handler_live.mylives);
    app.get('/mylives/refresh',handler_live.refreshMylives);
    //某一个直播的指导页面
    app.get('/mylives/:share_device_SN', handler_live.remoteadvice);
    app.get('/mylives/:hashed_id/send_txt_msg',handler_live.sendTxtMessage);
    app.get('/mylives/:hashed_id/RecorderInit',handler_live.RecorderInit);
    //－－－－－－－－－－－－－－－－－－－－点播－－－－－－－－－－－－－－－－－－－－
    app.all('/myrecords',checkLogin);
    app.all('/myrecords/*',checkLogin);
    //历史纪录列表
    app.get('/myrecords', handler_record.myrecords);
    //删除历史纪录
    app.post('/myrecords/delete', handler_record.delete_record);
    //观看历史纪录
    app.get('/myrecords/:hashed_id', handler_record.play_record);
    //重命名历史记录
    app.post('/myrecords/update', handler_record.update_record);
    //下载历史记录
    app.get('/myrecords/download/:id',handler_record.download_record);
    //播放记录列表
    app.get('/playloglist',handler_record.playloglist);
    //提价播放记录
    app.post('/myrecords/playlog/:id',handler_record.play_record_log);

    //－－－－－－－－－－－－－－－－－－－－订单－－－－－－－－－－－－－－－－－－－－
    app.all('/myorders',checkLogin);
    app.all('/myorders/*',checkLogin);
    //订单纪录
    app.get('/myorders', handler_order.myorders);
    //－－－－－－－－－－－－－－－－－－－－账单－－－－－－－－－－－－－－－－－－－－
    app.all('/mybills',checkLogin);
    app.all('/mybills/*',checkLogin);
    //账单纪录
    app.get('/mybills', handler_bill.mybills);

    //－－－－－－－－－－－－－－－－－－－－用户－－－－－－－－－－－－－－－－－－－－
    //用户列表
    app.get('/userlist',checkLogin);
    app.get('/userlist', handler_user.userlist);
    //打开登录界面
    app.get('/login',checkNotLogin);
    app.get('/login',handler_user.login);
    //提交登录请求
    app.post('/login',checkNotLogin);
    app.post('/login',handler_user.post_login);
    app.post('/iOS/login',handler_user.iOSLogin);

    //注册
    app.get('/reg',checkRegEnable);
    app.get('/reg',checkNotLogin);
    app.get('/reg',handler_user.reg);

    app.post('/reg',checkNotLogin);
    app.post('/reg',handler_user.post_reg);
    app.post('/reg/existsName',handler_user.existsName);
    app.post('/reg/existsEmail',handler_user.existsEmail);

    /**
    //注册页面
    app.get('/reg_test20160506',checkNotLogin);
    app.get('/reg_test20160506',handler_user.reg);
    //提交用户注册请求
    app.post('/reg_test20160506',checkNotLogin);
    app.post('/reg_test20160506',handler_user.post_reg);
    app.post('/reg_test20160506/existsName',handler_user.existsName);
    app.post('/reg_test20160506/existsEmail',handler_user.existsEmail);
     */
    //用户信息
    app.get('/myinfo',checkLogin);
    app.get('/myinfo/*', checkLogin);
    app.get('/myinfo', handler_user.myinfo);
    app.post('/myinfo/comparePwd',handler_user.comparePwd);
    app.post('/myinfo',handler_user.updatePwd);
    //－－－－－－－－－－－－－－－－－－－－好友－－－－－－－－－－－－－－－－－－－－
    app.get('/myfriends', handler_friend.myfriends);
    app.get('/myfriends/video/:id', handler_friend.video);
    app.get('/myfriends/records/:id', handler_friend.records);
    app.get('/myfriends/loadFriendsData',handler_friend.FriendsData)
    app.get('/myfriends/disposable',handler_friend.disposable)
    app.get('/myfriends/records',handler_friend.recordsData)
    app.post('/myfriends/add',handler_friend.add)
    app.post('/myfriends/disposableShare',handler_friend.disposableShare)
    app.post('/myfriends/videoshare',handler_friend.videoShare)
    app.post('/myfriends/recordsShare',handler_friend.recordsShare)
    app.post('/myfriends/removevideoShare/:id',handler_friend.deleteVideoShare)
    app.post('/myfriends/remove/:id',handler_friend.delete)
    //观看好友分享的历史纪录
    app.get('/myfriends/:hashed_id', handler_friend.play_record)
    //－－－－－－－－－－－－－－－－－－－－回调－－－－－－－－－－－－－－－－－－－－
    app.get('/v/Auth',handler_callback.Auth);
    app.post('/v/RecordStart',handler_callback.RecordStart);
    app.post('/v/RecordStop',handler_callback.RecordStop);
    app.post('/v/SaveVideo',handler_callback.SaveVideo);
    app.post('/v/UserOffline',handler_callback.UserOffline);
    app.post('/v/ThumbnailsCreate',handler_callback.ThumbnailsCreate);
    app.post('/v/RecordRecovery',handler_callback.RecordRecovery);


    //－－－－－－－－－－－－－－－－－－－－流媒体－－－－－－－－－－－－－－－－－－－－
    app.post('/stream/pushRtmp',handler_stream.pushRtmp);
    app.post('/stream/killProcess',handler_stream.killProcess);

}

//未登录则跳转至登录界面
function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('success', '');
        req.flash('error','')
        req.flash('error','未登录');
        res.redirect('/login');
    }
    next();
}

//已登录则返回
function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('success', '');
        req.flash('error','')
        req.flash('error','已登录');
        res.redirect('/mylives');
        return;
    }
    next();
}

function betaReg(req, res){
    req.flash('error', '')
    req.flash('error', '内测阶段，暂未开放注册功能。');
    res.redirect('/login');
}
/*

 静态情况下，点了注册，reg路由，判断开关，关：alert，开：正常注册
 动态，手动拼参数，t＝date md5 8 ，进行参数判断， 关：判断md5是否正确，md5to404. 关：404
 func 放在util里，抽出来。
*/
function checkRegEnable(req,res,next) {
    if (config.reg_switch == 'true') {
        next();
    }else{
        var today_param = req.query.t;

        if (typeof(today_param) == "undefined" || today_param.length != config.PARAM_LEN) {
            betaReg(req, res);
        }else{
            var moment = require("moment");
            var crypto = require('crypto');
            var md5 = crypto.createHash('md5');
            var today = moment().format("YYYY-MM-DD");
            var today_md5 = md5.update(today).digest('hex').substr(0, config.PARAM_LEN);
            console.log(TAG, 'today='+today+', today_md5='+today_md5+', today_param='+today_param);
            if (today_param == today_md5){
                next();
            }else{
                betaReg(req, res);
            }
        }
    }

    //var moment = require("moment");
    //var crypto = require('crypto');
    //var md5 = crypto.createHash('md5');
    //var date = moment().format("YYYY-MM-DD");
    //var tm = md5.update(date).digest('hex').substr(0, 8);
    //var tp = req.param.t;
    //var result=true;
    //
    //if (config.reg_switch == 'false') {
    //    if (typeof(tp) != "undefined" && tp.length > 0) {
    //        if (tm != tp) {
    //            result=false;
    //        }
    //    } else {
    //        result=false;
    //    }
    //}
    //if(!result){
    //    req.flash('error', '')
    //    req.flash('error', '内测阶段，暂未开放注册功能。');
    //    res.redirect('/login');
    //    return;
    //}
    //next();
}