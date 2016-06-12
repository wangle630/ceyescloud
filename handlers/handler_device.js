var Device = require('../module/module_device');
var Device_conf = require('../module/module_device_conf');
var crypto = require('crypto');
var uuid = require('node-uuid');

exports.mydevices = function(req,res){
    userid = req.session.user.id;
    Device.getUserDevice(userid,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows){
            res.render('mydevices',{
                title:'我的设备',
                rows:rows,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        }
    })
}

exports.devicelist = function(req,res){
    Device.getAll( function(err , rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows){
            res.render('devicelist',{
                title:"所有设备",
                rows:rows,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        }
    });
}

exports.post_mydevice = function(req,res){
}

exports.bind_qrcode = function(req,res){
    var user=req.session.user;
    var content='{"type":"0","userid":"'+user.id+'","username":"'+user.accountName+'"}';
    console.log(content);
    var shell = require('child_process').spawn;
    var uuid=genShortUUID();
    console.log('uuid----------------------'+uuid);
    var path='/tmp/ceyescloud/'+uuid+'.png';
    var qr = shell('./qr',['-path='+path,'-json='+content]);
    qr.stdout.on('data', function (data) {
        console.error('stdout-----: ' + data);
    });

    qr.stderr.on('data', function (data) {
        console.error('stderr---: ' + data);
    });

    qr.on('exit', function (code) {
        console.error("generate a qr image ---"+code);
        res.send('/img/ceyescloud/'+uuid+'.png');
    });
}

function genShortUUID() {
    var u4 = uuid.v4().replace('-','');
    console.log(u4);
    var b = new Buffer('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-');
    Buffer.prototype.toByteArray = function () {
        return Array.prototype.slice.call(this, 0)
    };
    var m = b.toByteArray();

    var idx = "";
    for (var i = 0; i < 16; i += 2) {
        var u = (parseInt(u4[i],16)<<4) + parseInt(u4[i+1],16);
        var j = u % 64;
        idx += String.fromCharCode(m[j]);
    }
    return idx;
}

exports.wifi_qrcode = function(req,res){
    var ssid=req.query.ssid;
    var pwd=req.query.pwd;
    var wifiCryto=req.query.wifiCryto;
    var content='{"type":"1","ssid":"'+ssid+'","pwd":"'+pwd+'","wifiCryto":"'+wifiCryto+'"}';

    var shell = require('child_process').spawn;
    var uuid=genShortUUID();
    var path='/tmp/ceyescloud/'+uuid+'.png';
    var qr = shell('./qr',['-path='+path,'-json='+content]);
    qr.stdout.on('data', function (data) {
        console.error('stdout-----: ' + data);
    });

    qr.stderr.on('data', function (data) {
        console.error('stderr---: ' + data);
    });

    qr.on('exit', function (code) {
        console.error("generate a qr image ---"+code);
        res.send('/img/ceyescloud/'+uuid+'.png');
    });
}

exports.bind_wifi_qrcode = function(req,res){
    var ssid=req.query.ssid;
    var pwd=req.query.pwd;
    var wifiCryto=req.query.wifiCryto;
    var user=req.session.user;
    var type=req.query.type;
    var content="";
    if('WB'==type){
        content='{"type":"3","userid":"'+user.id+'","username":"'+user.accountName+'","ssid":"'+ssid+'","pwd":"'+pwd+'","wifiCryto":"'+wifiCryto+'"}';
    }else if("B"==type){
        content='{"type":"0","userid":"'+user.id+'","username":"'+user.accountName+'"}';
    }else if("W"){
        content='{"type":"1","ssid":"'+ssid+'","pwd":"'+pwd+'","wifiCryto":"'+wifiCryto+'"}';
    }

    console.log(content);
    if(""!=content) {
        var shell = require('child_process').spawn;
        var uuid = genShortUUID();
        var path = '/tmp/ceyescloud/' + uuid + '.png';
        var qr = shell('./qr', ['-path=' + path, '-json=' + content]);
        qr.stdout.on('data', function (data) {
            console.error('stdout-----: ' + data);
        });

        qr.stderr.on('data', function (data) {
            console.error('stderr---: ' + data);
        });

        qr.on('exit', function (code) {
            console.error("generate a qr image ---" + code);
            res.send('/img/ceyescloud/' + uuid + '.png');
        });
    }
}


exports.unbind_device = function(req,res){
    var userid=req.session.user.id;
    Device.unblind(req.params.deviceSN,userid,function(err,rows){
        if(err){
            req.flash('error','解绑失败啦');
            return  res.redirect('/mydevices');
        }
        req.flash('success','解绑成功啦');
        res.redirect('/mydevices');
    })
}

exports.detail_device = function(req,res){
    var deviceid = req.params.deviceid;
    Device.getDetail( deviceid,function(err,deviceinfo){
        if(err){
            req.flash('error', err);
            res.send(err);
        }
        if(deviceinfo){
            res.send(deviceinfo);
        }
    });
}

exports.deviceconf = function(req,res){
    var deviceid = req.params.deviceid;
    Device_conf.getConfbyDev(deviceid,function(err , rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows){
            res.render('device_config_show',{
                title:"设备配置信息",
                rows:rows,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        }
    });
}

exports.edit_deviceconf = function(req,res){
    var configid = req.params.configid;
    Device_conf.getConfbyID(configid,function(err , rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows){
            res.render('device_config_edit',{
                title:"编辑配置",
                rows:rows,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        }
    });
}

exports.post_deviceconf = function(req,res){
    //var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var date = new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
    var param=[req.body.resolution,req.body.audioCodec,req.body.videoCodec,req.body.fps,req.body.bps,
    req.body.offlineresolution,req.body.offlineaudioCodec,req.body.offlinevideoCodec,req.body.offlinefps,req.body.offlinebps,req.body.localvideoupload,req.body.deletelocalfile,date,req.params.configid];
    Device_conf.update(param,function(err,rows){
        if(err){
            req.flash('error','修改失败啦');
            return res.redirect('back');
        }
        req.flash('success','修改成功啦');
        res.redirect('/mydevices/conf/' + req.body.device_id  );
    })
};

exports.bind_device = function(req,res) {
    var deviceSN = req.body.deviceSN,
        accountID = req.body.userid,
        accountName = req.body.username,
        deviceType = req.body.deviceType.toLowerCase(),
        modelName=req.body.modelName,
        deviceName = modelName,
        deviceinfo = '{"rom_v": "","os_type": "","os_v": "","software_v": "","gps": "","storage_userd": "", "storage_size": "" }';
        console.error('--------start-----bind_device');
        console.error(deviceSN, accountID, accountName, deviceType, deviceName);

    var md5 = crypto.createHash('md5'),
        md55 = crypto.createHash('md5'),
        md555 = crypto.createHash('md5'),
        date = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''),
        id = md5.update(deviceSN + accountName + date).digest('hex'),
        mediaconfid = md55.update(id + deviceinfo).digest('hex'),
        videosourceid = md555.update(mediaconfid + accountID).digest('hex');

    var newDevice = new Device(id, deviceSN, deviceType, deviceName, accountID, accountName, 'Yes', deviceinfo, date, date, '0.00', '5120.00');
    //检查SN和类型是否为空
    if (deviceSN.length < 1 || accountID.length < 1|| accountName.length < 1 ||deviceType.length<1||modelName.length<1 ) {
        res.send('{"ret":10001}');
        console.error('{"ret":10001}');
        return;
    }

    /**
     * 判断数据库里此前是否有此设备记录
     * 无：新增
     * 有：
     * 1.判断设备可用状态：
     * 1.1.可用：返回10002(不能重复绑定);
     * 1.2.不可用：
     * 1.2.1:更改t_device此设备绑定的accountID为此次绑定的accountID，并且更新enable为Yes
     * 1.2.2:插入t_video_source：share_account_id、share_account_name
     *
     */
    Device.getBindUser(accountID, accountName, function (err, rows) {
        if (err) {
            res.send('{"ret":10000}');
            console.error('{"ret":10000}');
        }
        if (rows != null && rows.length !== 0) {
            Device.getOneBySN(deviceSN, function (err, rows) {
                if (rows.length !== 0) {
                    var enable = rows[0].enable;
                    if ('Yes' == enable) {
                        res.send('{"ret":10002}');
                        console.error('{"ret":10002}');
                        return;
                    } else if ('No' == enable) {
                        newDevice.UpdateEnableInsertSource(videosourceid, function (err, rows) {
                            if (err) {
                                res.send('{"ret":10000}');
                                console.error('{"ret":10000}');
                            }
                            res.send('{"ret":0}');
                            console.error('{"ret":0}');
                            return;
                        })
                    }
                } else {
                    //如果不存在则新增用户
                    newDevice.save2(mediaconfid, videosourceid, function (err) {
                        if (err) {
                            res.send('{"ret":10000}');
                            console.error('{"ret":10000}');
                        }
                        res.send('{"ret":0}');
                        console.error('{"ret":0}');
                        return;
                    });
                }
            });
        } else {
            res.send('{"ret":10003}');
            console.error('{"ret":10003}');
            return;
        }
    });
    console.error('--------end-----bind_device');
};

exports.rename_device = function(req,res){
    var deviceID = req.body.deviceID;
    var deviceName = req.body.deviceName;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    Device.rename(deviceID,deviceName,date,function(err,row){
        if (err) {
            req.flash('error', '修改失败啦');
            return res.redirect('/mydevices');
        }
        req.flash('success', '修改成功啦');
        res.redirect('/mydevices');
    })
}

exports.config_qrcode = function(req,res){
    var configid = req.params.configid;
    var content='{"type":"2","configid":"'+configid+'"}';
    var shell = require('child_process').spawn;
    var uuid=genShortUUID();
    var path='/tmp/ceyescloud/'+uuid+'.png';
    var qr = shell('./qr',['-path='+path,'-json='+content]);
    qr.stdout.on('data', function (data) {
        console.error('stdout-----: ' + data);
    });

    qr.stderr.on('data', function (data) {
        console.error('stderr---: ' + data);
    });

    qr.on('exit', function (code) {
        console.error("generate a qr image ---"+code);
        res.send('/img/ceyescloud/'+uuid+'.png');
    });
}

exports.deviceHardwareInfo = function(req,res){
    var rom_v = req.body.rom_v;
    var os_type=req.body.os_type;
    var os_v=req.body.os_v;
    var software_v=req.body.software_v;
    var gps=req.body.gps;

    var storage_available=req.body.storage_available;
    var storage_size=req.body.storage_size;
    var deviceSN=req.body.deviceSN;
    var modelName=req.body.modelName;
    var uploadTime=req.body.uploadTime;
    if(typeof(rom_v) == "undefined"||rom_v.length<=0
        ||typeof(os_type) == "undefined"||os_type.length<=0
        ||typeof(os_v) == "undefined"||os_v.length<=0
        ||typeof(software_v) == "undefined"||software_v.length<=0
        ||typeof(gps) == "undefined"||gps.length<=0
        ||typeof(storage_available) == "undefined"||storage_available.length<=0
        ||typeof(storage_size) == "undefined"||storage_size.length<=0
        ||typeof(deviceSN) == "undefined"||deviceSN.length<=0
        ||typeof(modelName) == "undefined"||modelName.length<=0
        ||typeof(uploadTime) == "undefined"||uploadTime.length<=0
    ){
        res.send('{"ret":10001}');
        console.error('{"ret":10001}');
        return;
    }
    var deviceInfo='{"rom_v": "'+rom_v+'","os_type": "'+os_type+'","os_v": "'+os_v+'","software_v": "'+software_v+'","gps": "'+gps+'","storage_available": "'+storage_available+'", "storage_size": "'+storage_size+'","modelName":"'+modelName+'","uploadTime":"'+uploadTime+'" }';
    var param=[deviceInfo,deviceSN];
    console.error('deviceHardwareInfo:-----'+param);
    Device.deviceHardwareInfo(param,function(err , rows){
        if(err){
            res.send('{"ret":10000}');
            return;
        }
        if(rows){
            res.send('{"ret":0}');
        }
    });
}

exports.config_update = function(req,res){
    var configid = req.body.configid;
    if (typeof(configid) == "undefined"||configid.length<=0) {
            res.send('{"ret":10001}');
            console.error('{"ret":10001}');
            return;
    }
    Device_conf.getConfbyID(configid,function(err , rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows&&rows.length>0){
            var result;
            for(var i=0; i < rows.length; i++) {
                result = '[{'+
                    '"id": "'+rows[i].id+'",'+
                    '"device_id": "'+rows[i].device_id+'",'+
                    '"resolution": "'+rows[i].resolution+'",'+
                    '"audioCodec": "'+rows[i].audioCodec+'",'+
                    '"videoCodec": "'+rows[i].videoCodec+'",'+
                    '"fps": "'+rows[i].fps+'",'+
                    '"bps": "'+rows[i].bps+'",'+
                    '"sound": "'+rows[i].sound+'",'+
                    '"offlineresolution": "'+rows[i].offlineresolution+'",'+
                    '"offlineaudioCodec": "'+rows[i].offlineaudioCodec+'",'+
                    '"offlinevideoCodec": "'+rows[i].offlinevideoCodec+'",'+
                    '"offlinefps": "'+rows[i].offlinefps+'",'+
                    '"offlinebps": "'+rows[i].offlinebps+'",'+
                    '"localvideoupload": "'+rows[i].localvideoupload+'",'+
                    '"deletelocalfile": "'+rows[i].deletelocalfile+'",'+
                    '"Updated": "'+rows[i].Updated+'"'+
                    '}]';
            }
            console.error(result);
            res.send(result);
        }else{
            res.send('{"ret":10004}');
        }
    });
}

exports.getConfigInfo= function(req,res) {
    var deviceSN = req.body.deviceSN;
    if (typeof(deviceSN) == "undefined"||deviceSN.length<=0) {
        res.send('{"ret":10001}');
        console.error('{"ret":10001}');
        return;
    }
    Device_conf.getConfbySN(deviceSN,function(err , rows){
        if(err){
            res.send('{"ret":10000}');
            console.error('{"ret":10000}');
            return;
        }
        if(rows && rows.length>0){
            var result;
            for(var i=0; i < rows.length; i++) {
                result = '{'+
                    '"configid": "'+rows[0].id+'",'+
                    '"updated": "'+rows[0].updated+'"'+
                    '}';
            }
            console.error(result);
            res.send(result);
        }else{
            res.send('{"ret":10004}');
        }
    });
}
exports.getBindInfo = function(req,res){
    var deviceSN = req.body.deviceSN;
    if (typeof(deviceSN) == "undefined"||deviceSN.length<=0) {
        res.send('{"ret":10001}');
        console.error('{"ret":10001}');
        return;
    }
    Device.getBindInfo(deviceSN,function(err , rows){
        if(err){
            res.send('{"ret":10000}');
            console.error('{"ret":10000}');
            return;
        }
        if(rows){
            if(rows && rows.length>0){
                var result = '{"ret":0,'+
                    '"accountID": "'+rows[0].accountID+'",'+
                    '"accountName": "'+rows[0].accountName+'"'+
                    '}';
                res.send(result);
            }else {
                res.send('{"ret":10004}');
            }
        }
    });
}

