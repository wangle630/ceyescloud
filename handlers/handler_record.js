var mysql=require("../public/javascripts/mysql/mysql.js");
var Record = require('../module/module_record');
var crypto = require('crypto');

exports.myrecords = function(req,res) {
    userid = req.session.user.id;
    var username = req.session.user.accountName;
    var pageNow = req.query.pageNow;
    var pageSize = req.query.pageSize;
    var status = req.query.state;
    var pagecount;
    if (typeof(pageNow) == "undefined") {
        pageNow = 1;
    }
    if (typeof(pageSize) == "undefined") {
        pageSize = 12;
    }
    if (typeof(status) == "undefined") {
        status = 0;
    }
    Record.getVideoSourceCount(userid,status,username ,function (err, rows) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        if (rows) {
            pagecount = rows[0].count;

            Record.getVideoSource(userid, pageNow, pageSize,status,username,function (err, rows) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                if (rows) {
                    res.render('myrecords', {
                        title: '历史记录',
                        rows: rows,
                        pagecount: pagecount,
                        pageSize: pageSize,
                        pageNow: pageNow,
                        status:status,
                        user: req.session.user,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });
                }
                /*分辨率720 码率1500*/
            })
        }
    })
}

exports.playloglist = function(req,res){
    accountID = req.session.user.id;
    Record.getPlayLog(accountID,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows){
            res.render('playlog',{
                title:'历史记录播放日志',
                rows:rows,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        }
    })
}

exports.delete_record = function(req,res){
    var hashed_id=req.body.hashed_id;
    var deviceSN=req.body.deviceSN;
    var param1=[hashed_id,deviceSN];
    var param2=[hashed_id];
    Record.delete(param1,param2,function(err,rows){
        if (err) {
            req.flash('error', '删除失败啦');
            return res.redirect('/myrecords');
        }
        if(rows) {
            if(rows.changedRows>0){
                req.flash('success', '删除成功啦');
                res.redirect('/myrecords');
            }
        }
    })
}

exports.play_record = function(req,res){
    var userid = req.session.user.id;
    var hashed_id = req.params.hashed_id;
    var param=[hashed_id];
    Record.getIshashed(userid,hashed_id,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        console.log(rows[0].count)
        if(rows[0].count==0){

            return res.redirect('/myrecords');
        }else{
            Record.play_record(param,function(err,rows){

                if(rows){
                    res.render('playrecord',{
                        title:'视频回放',
                        hashed_id:hashed_id,
                        user:req.session.user,
                        success:req.flash('success').toString(),
                        error:req.flash('error').toString(),
                        returnValue:rows[0]
                    });
                }
            })
        }
    })

}

exports.update_record=function(req,res){
    var file_name=  req.body.file_name;
    var hashed_id = req.body.hashed_id;
    var sql="UPDATE t_video SET remark=? WHERE hashed_id=? AND TYPE =2";
    var param=[file_name,hashed_id];
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            req.flash('error', '修改失败啦');
            return res.redirect('/myrecords');
        }
        if(vals) {
            if(vals.changedRows>0){
                req.flash('success', '修改成功啦');
                res.redirect('/myrecords');
            }
        }
    });
};

exports.play_record_log = function(req,res){

    var accoundid = req.body.accoundid,
        accoundName = req.session.user.name,
        hashed_id = req.body.hashed_id,
        size = req.body.size,
        duration = req.body.duration,
        randomid = req.body.randomid,
        palyedRange = req.body.palyedRange,
        buffRange = req.body.buffRange;

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        console.warn(ip);

    var md5 = crypto.createHash('md5'),
        id = md5.update(accoundid + hashed_id + randomid ).digest('hex'),
        date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    Record.saveLog(id,randomid,accoundid,accoundName,hashed_id,size,duration,palyedRange,buffRange,date, function (err, rows) {
        if (!rows) {
            res.send('error');
        }
        res.send('success');;
    });

}

var urlparse = require('url').parse
    , http = require('http')
    , fs = require('fs');

exports.download_record=function(req,res){
    var sql="SELECT url,file_name FROM t_video WHERE hashed_id=? AND TYPE =2";
    var param=[req.params.id];
    mysql.executeSql(sql,param,function(err,vals){
        if (err) {
            throw err;
        }
        if(vals) {
           if(vals.length>0) {
               var returnValue = vals[0].url;
               var name = vals[0].file_name;
               res.json({returnValue:returnValue,name:name});
               //var url = returnValue;
               //var savefile;
               //if (!name.match('.mp4')) {
               //    savefile = name + '.mp4';
               //} else {
               //    savefile = name;
               //}
               //var urlinfo = urlparse(url);
               //var options = {
               //    method: 'GET',
               //    host: urlinfo.hostname,
               //    path: urlinfo.pathname
               //};
               //if (urlinfo.port) {
               //    options.port = urlinfo.port;
               //}
               //if (urlinfo.search) {
               //    options.path += urlinfo.search;
               //}
               //var body;
               //
               //var reqhttp = http.request(options, function (reshttp) {
               //    var writestream = fs.createWriteStream(savefile);
               //    writestream.on('data', function (data) {
               //        body += writestream.write(data);
               //    });
               //    writestream.on('end', function () {
               //        writestream.end();
               //        reshttp.pipe(res);
               //    });
               //});
               //reqhttp.end();
           }
            //res.download(savefile);
        }
    });
};



