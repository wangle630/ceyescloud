
/*引用模块*/
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var io = require('socket.io')();

//用户相关功能
var routes = require('./routes/index');
var admin = require('./routes/admin');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

//文件操作对象
var fs = require('fs');
//时间格式化
var moment = require('moment');
/*模板引擎*/
var partials = require('express-partials');
/*实例化express对象*/
var app = express();
//ueditor注册
var ueditor = require('ueditor-nodejs');
var config=require("./config.js");
// view engine setup
//静态压缩
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'})); // 限制上传5M
app.use(bodyParser.urlencoded({ extended: false , limit: '50mb' }));
app.use(cookieParser());

//解决异步层次混乱问题
app.use(require('express-promise')());

//事件监听
app.io = io;
io.on('connection', function (socket) {
});

app.use(express.static(path.join(__dirname, 'public')));

var options = {
    "host": "127.0.0.1",
    "port": config.redis_port,//SERVER200 6479
    "ttl": 60 * 60 * 24 * 30   //Session的有效期为30天
    //useConnectionPooling: true
};

app.use(session({
    secret:'ceyesclund',
    key:'ceyesclund',//cookie的名字
    cookie:{maxAge:1000 * 60 * 60 * 24 * 30},//30天生存期
    //resave : 是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
    resave: true,
    //saveUninitialized: 是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    saveUninitialized: false,
    store: new RedisStore(options)
}))

app.use(function (req, res, next) {
    //var header =req.header;
    //x-requested-with
    //XMLHttpRequest
    if (!req.session) {
        return next(new Error('oh no')) // handle error
    }
    next() // otherwise continue
});

//路由控制器
require('./routes.js')(app);

//app.use('/', routes(io,"a"));
////平台管理员
app.use('/p', admin(io,"p"));
//app.use('/v',video(io,"v"));

app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

module.exports = app;
