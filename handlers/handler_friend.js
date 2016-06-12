var MSUser = require('../module/module_user');
var Friend = require('../module/module_friend');
var Record = require('../module/module_record');
exports.add  = function(req,res){
    userid = req.session.user.id;
    username = req.session.user.accountName;
    var accountName = req.body.accountName.trim();
    if(username == accountName){
            req.flash('error', '不能添加自己!');
            return res.redirect('/myfriends');
    }
    MSUser.getOne(accountName,function(err,user){
        if (user.length == 0) {
            req.flash('error', '用户不存在!');
            return res.redirect('/myfriends');
        }
        Friend.getOne(userid,user[0].id,function(err,row){
            if(err){
                req.flash('error', '添加失败!');
                return res.redirect('/myfriends');
            }
            if(row.length == 0){
                var newFriend = new Friend (userid,user[0].id);
                newFriend.save(function(err,user){
                    if (err) {
                        req.flash('error', err);
                        return res.redirect('/mydevices');
                    }
                    req.flash('success', '添加成功!');
                    res.redirect('/myfriends');
                })
            }else{
                req.flash('error', '该用户以添加!');
                return res.redirect('/myfriends');
            }

        })

    })
 }
exports.myfriends = function(req,res){
    userid = req.session.user.id;
    MSUser.getFriend(userid,function(err,rows){
        if (err){
            req.flash('error', err);
        }
        if (rows){
            res.render('myfriends',{
                title:'我的好友',
                rows:rows,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });

        }


    })

}
//查询直播共享好友数据
exports.FriendsData = function(req,res){
    var userid = req.session.user.id;
    var sn     = req.query.sn;
    Friend.getQeryShare(1,userid,sn,function(err,rows){
        if (err){
            req.flash('error', err);
        }
        if (rows) {
            var str ="" ;
            rows.forEach(function (row) {
                str += "{\"id\":\"" + row.id + "\",\"text\":\"" + row.accountName + "\",\"type\":\""+row.type+"\"},";
            })
            str ="["+ str.substring(0, str.length - 1) + "]";
            res.send(str);
        }
    })
}
//查询历史共享好友数据
exports.recordsData = function(req,res){
    var userid = req.session.user.id;
    var sn     = req.query.sn;
    var vid     = req.query.vid;
    Friend.getrecordsQeryShare(3,userid,sn,vid,function(err,rows){
        if (err){
            req.flash('error', err);
        }
        if (rows) {
            var str = "";
            rows.forEach(function (row) {
                    str += "{\"id\":\"" + row.id + "\",\"text\":\"" + row.accountName + "\",\"type\":\""+row.type+"\"},";
            })
            str = "["+ str.substring(0, str.length - 1) + "]";
            res.send(str);
        }
    })
}

//查询直播一次性共享好友数据
exports.disposable = function(req,res){
    var userid      = req.session.user.id;
    var sn          = req.query.sn;
    var hashedid    = req.query.hashedid;
    Friend.getQeryShare(1, userid,sn,function(err,rows){
        if (err){
            req.flash('error', err);
        }
        if (rows) {
            console.log(hashedid);
            var str = "";
            rows.forEach(function (row) {
                if(row.type == 0 ){
                    var type = row.hashedid == hashedid ? 1:0;
                    str += "{\"id\":\"" + row.id + "\",\"text\":\"" + row.accountName + "\",\"type\":\""+type+"\"},";
                }
            })
            str = "["+ str.substring(0, str.length - 1) + "]";
            res.send(str);
        }
    })
}
//一次性共享
exports.disposableShare = function(req,res){
    var userid   = req.session.user.id;
    var picks  = JSON.parse(req.body.pickids);
    var sn       = req.body.sn.toString();
    var hashedid = req.body.hashedid.toString();
    Friend.savedisposableShare(userid,picks,sn,hashedid,function(err){
        if (err) {
            res.send("操作失败！");
        }
    })
    res.send("操作成功！");
}

exports.play_record = function(req,res){
    var hashed_id = req.params.hashed_id;
    var param=[hashed_id];
    Record.play_record(param,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows){
            res.render('myfriendsplayrecord',{
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
//历史共享
exports.recordsShare = function(req,res){
    var userid   = req.session.user.id;
    var picks  = JSON.parse(req.body.pickids);
    var sn       = req.body.device_SN.toString();
    var vid = req.body.vid.toString();
    Friend.saverecordsShare(userid,picks,sn,vid,function(err){
        if (err){
            req.flash('error', '操作失败!');
            return res.redirect('/myrecords');
        }
    })
    req.flash('success', '操作成功!');
    return res.redirect('/myrecords');

}
//直播永久共享
exports.videoShare = function(req,res){
    var userid   = req.session.user.id;
    var picks  = JSON.parse(req.body.pickids);
    var sn       = req.body.device_SN.toString();
    var deviceId = req.body.device_id.toString();
    Friend.updateShare(sn,userid,function(err){
        if (err) {
            req.flash('error', '操作失败!');
            return res.redirect('/mylives');
        }
    });
    if(picks.length == 0){
        req.flash('success', '操作成功!');
        return res.redirect('/mylives');
    }else{
        Friend.saveShare(userid,picks,sn,deviceId,function(err){
            if (err){
                req.flash('error', '操作失败!');
                return res.redirect('/mylives');
            }else{
                req.flash('success', '操作成功!');
                return res.redirect('/mylives');
            }

        });
    }

}
//查看好友共享的直播源
exports.video = function(req,res){
    userid = req.session.user.id;
    Friend.getVideoSource(userid,req.params.id,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/myfriends');
        }
        if(rows){
            res.render('myfriendslives',{
                title:'可看直播',
                rows:rows,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        }
    })
}
//查看好友共享的历史
exports.records = function(req,res){
    userid = req.session.user.id;
    Friend.getRecordSource(userid,req.params.id,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/myfriends');
        }
        if(rows){
            res.render('myfriendsrecords',{
                title:'历史记录',
                rows:rows,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        }
    })
}

exports.deleteVideoShare = function(req,res){
    var id = req.params.id;
    Friend.deleteVideoShare(id,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }

        req.flash('success', '删除成功!');
        return res.redirect('/myinfo');
    })
}
exports.delete = function(req,res){
    var id = req.params.id;
    var rid = req.body.rid;
    var userid = req.session.user.id;
    Friend.delete(id,rid,userid,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }

        req.flash('success', '删除成功!');
        return res.redirect('/myfriends');
    })
}




