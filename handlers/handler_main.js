var mrecord = require('../module/module_record');

var config=require("../config.js");


exports.home = function(req,res){
    res.render('index',{
        title:'首页',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
}

exports.logout = function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');//跳转到首页
}


exports.download = function(req,res){
    res.render('download',{
        title:'资源下载',
        user:req.session.user,
        link:config.download_link,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
}


exports.fengtest = function (req, res) {
    res.render('fengtest', {
        title: '封测流程',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

exports.sum_cdrs = function (req, res) {
    res.render('m_sum_cdrs', {
        title: '消费明细查询',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

exports.rtmpPublish = function (req, res) {
    res.render('m_rtmp_publish', {
        title: '推送服务',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}


exports.jwplayer_rtmp = function (req, res) {
    mrecord.getLiveList(function (err, rows) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (rows) {
                var list = '';
                rows.forEach(function (row) {

                    console.log(row.url.indexOf("rtmp"))

                    if(row.url.indexOf("rtmp") >= 0){
                        if(row.size == '0x0'){
                            var item = row.url + '|' + '语音:'  + row.author

                        }else{
                            var item = row.url + '|' + row.author

                        }
                        list += item + ','
                    }
                })
                res.render('m_jwplayer_rtmp', {
                    title: '测试jwplayer',
                    user: req.session.user,
                    liveList: list,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            }
        }
    )
    ;
}

exports.jwplayer_hls = function (req, res) {
    mrecord.getLiveList(function (err, rows) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (rows) {
                var list = '';
                rows.forEach(function (row) {

                    if(row.url.indexOf("http:") >= 0){
                        if(row.size == '0x0'){
                            var item = row.url + '|' + '语音:'  + row.author

                        }else{
                            var item = row.url + '|' + row.author

                        }
                        list += item + ','
                    }
                })
                res.render('m_jwplayer_hls', {
                    title: '测试jwplayer',
                    user: req.session.user,
                    liveList: list,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            }
        }
    )
    ;
}