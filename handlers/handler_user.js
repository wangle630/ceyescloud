var MSUser = require('../module/module_user');
var crypto = require('crypto');

exports.reg = function (req, res) {
    res.render('reg',{
        title:'注册',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
};

exports.post_reg = function (req, res) {
    //req.body是POST请求信息解析过后的对象，req.body['password'] == req.body.password
    var name = req.body.name,
        email = req.body.email,
        password = req.body.password,
        password_re = req.body['password-repeat'];

    var md5 = crypto.createHash('md5'),
        id = md5.update(req.body.name).digest('hex'),
        //date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        date =new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
    var newUser = new MSUser(id,name,password,email,'1','',date,date);
    //检查用户是否存在
    MSUser.getOne( name, function (err, user) {
        if (user.length !== 0) {
            req.flash('error', '用户已存在!');
            return res.redirect('/reg');
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');//注册失败返回主册页
            }
            req.session.user = newUser;//用户信息存入 session
            req.flash('success', '注册成功!');
            res.redirect('/');//注册成功后返回主页
        });
    });
};

//打开登录页
exports.login = function(req,res){
    res.render('login',{
        title:'登录',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
};

exports.post_login = function(req,res){
    //req.body是POST请求信息解析过后的对象，req.body['password'] == req.body.password
    var name = req.body.name.trim(),
        password = req.body.password;
    //检查用户是否存在
    MSUser.getOnePlus(name, function (err,user) {
        if (!user || user.length == 0) {
            req.flash('error', '用户不存在!');
            return res.redirect('/login');
        }
        if(user[0].Password != password){
            req.flash('error','密码错误');
            return res.redirect('/login');
        }
        var currentUser = new MSUser(
            user[0].id,
            req.body.name,
            user[0].Password,
            user[0].email,
            '1',
            0,
            user[0].Created,
            user[0].Updated);

        //用户和密码匹配后存入session
        req.session.user = currentUser;
        req.flash('success','登录成功');
        res.redirect('/');//登录成功后，跳转到首页
    });
}

exports.iOSLogin = function(req,res){
    var name = req.body.name.trim(),
        password = req.body.password;
    //检查用户是否存在
    MSUser.getOnePlus(name, function (err,user) {
        if (!user || user.length == 0) {
            res.send('{"ret": 10004}');
            return;
        }
        if(user[0].Password != password){
            res.send('{"ret": 10005}');
            return;
        }
        var currentUser = new MSUser(
            user[0].id,
            req.body.name,
            user[0].Password,
            user[0].email,
            '1',
            0,
            user[0].Created,
            user[0].Updated);

        //用户和密码匹配后存入session
        req.session.user = currentUser;
        res.send('{"ret": 0,"userid":"'+user[0].id+'","username":"'+user[0].accountName+'"}');
    });
}


exports.userlist = function(req,res){
    MSUser.getAll( function(err , rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows){
            res.render('userlist',{
                title:"MySQL用户列表",
                rows:rows,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        }
    });
}
exports.myinfo = function(req,res) {
    user = req.session.user;
    var records;
    var lives;
    MSUser.getVideoSource(user.id,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows){
            lives = rows;

    MSUser.getRecordSource(user.id,function(err,rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows){
            res.render('myinfo', {
                title: '我的账户',
                records:rows,
                lives:lives,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        }
    })
        }
    })

}
exports.comparePwd = function(req,res) {
    user = req.session.user;
    var pwdInput=req.body.param;
    if(user.Password!=pwdInput){
        res.json({"status":"n","info":"原始密码错误"});
    }else{
        res.json({"status":"y","info":"原始密码正确"});
    }
}
exports.updatePwd = function(req,res) {
    user = req.session.user;
    var newPwd=req.body.newPwd;
    if (typeof(newPwd) == "undefined" || newPwd.length <= 0) {

    }else{
        var param=[newPwd,user.id];
        MSUser.updatePwd(param, function(err , rows){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            if(rows){
                req.session.user = null;
                req.flash('success','修改成功');
                res.redirect('/');//跳转到首页
            }
        });
    }
}
exports.existsName = function(req,res) {
    var name = [req.body.param];
    var aa = /^[A-Za-z0-9]+$/;
    if (!aa.test(name)) {
        return res.json({"status": "n", "info": "请输入合法用户名"});
    } else {
        MSUser.existsName(name, function (err, rows) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (rows) {
                if (rows.length > 0) {
                    res.json({"status": "n", "info": "用户名已被占用"});
                } else {
                    res.json({"status": "y", "info": "用户名可以使用"});
                }
            }
        });
    }
}
exports.existsEmail = function(req,res) {
    var param=[req.body.param];
    MSUser.existsEmail(param,function(err , rows){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        if(rows){
            if(rows.length>0){
                res.json({"status":"n","info":"邮箱已被占用"});
            }else{
                res.json({"status":"y","info":"邮箱可以使用"});
            }
        }
    });
}




