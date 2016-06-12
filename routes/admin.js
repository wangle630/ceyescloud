var express = require('express');
var router = express.Router();
var url = require('url');
var config=require("../config.js");


//sessionId
var sessionID = "";


var returnAdminRouter = function(io,domain) {	 
	 //var host = config.test_api_ip;
	 //var port = config.test_api_port;
	//var host = config.dev_api_ip;
	//var port = config.dev_api_port;
	
    //管理员登录页面
    router.get('/', function(req, res, next) {
		console.log('admin')
        res.render('manage/adminLogin');
    });

	

// 管理员登录提交请求
    router.post('/validate', function(req, res, next) {
		console.log("login")
		var urlPath = "/p/validate";
		var opt={
			host:host,
			port:port,
			method:'POST',
			path:urlPath,
			headers:{
				'Content-Type':"application/json"
			}
		};
		//请求参数
		var data={
			username:req.body.username,
			password:req.body.password
		};
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
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
				console.log("error");
			});
		
		requ.write(JSON.stringify(data));
		requ.end();	
	

    });
	
	//获取菜单信息
	router.get('/Functions/Menu', function(req, res, next){
		var sessionID = req.headers.authorization;
		var urlPath = '/p/Functions/Menu';
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'GET',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
				reso.on('data', function(d){
					body += d
				});
				reso.on("end",function(){
					console.log(body)
					res.end(body);
				});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				//console.log("error");
			});
		
		//requ.write(JSON.stringify(data));
		requ.end();
	});

// 管理员退出
    router.get('/logout', function(req, res, next) {
        req.session.adminlogined = false;
        req.session.adminPower = '';
        req.session.adminUserInfo = '';
        res.redirect("/admin");
    });

//后台用户起始页
    router.get('/manage', function(req, res, next) {
		//console.log(req.query.sessionID)
		//sessionID = req.query.sessionID
        res.render('manage/public/adminTemp');
    });
	
	//个人信息
    router.get('/dashboard', function(req, res, next) {
		//console.log(req.query.sessionID)
		//sessionID = req.query.sessionID
        res.render('dashboard');
    });
	
	router.get('/Functions/Menu', function(req, res, next) {
		var sessionID = req.headers.authorization;
		var urlPath = '/p/Functions/Menu';
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'GET',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
				reso.on('data', function(d){
					body += d
				});
				reso.on("end",function(){
					console.log(body)
					res.end(body);
				});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				//console.log("error");
			});
		
		//requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//请求客户信息页面
	router.get('/custom', function(req, res, next) {
		console.log("custom")
		//res.render('custom');
        //adminFunc.renderToManagePage(req, res,'custom');
		res.render('custom');
    });
	
	//获取客户信息
	router.get('/Customers', function(req, res, next) {
		var sessionID = req.headers.authorization;
		var id = req.query.id
		var page = req.query.page;
		var per_page = req.query.per_page;
		var urlPath = '/p/Customers';
		if (id!=null){
			urlPath += '/'+id;
		}else{
			urlPath += "?page="+page+"&per_page="+per_page;
		}
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'GET',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
				reso.on('data', function(d){
					body += d
				});
				reso.on("end",function(){
					//console.log(body)
					res.end(body);
				});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				//console.log("error");
			});
		
		//requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//添加客户信息
	router.post('/Customers', function(req, res, next) {
		var page = req.query.page;
		var per_page = req.query.per_page;
		var urlPath = '/p/Customers'+"?page="+page+"&per_page="+per_page;
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'POST',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		//请求参数
		var data={
			address:req.body.address,
			company:req.body.company,
			customerName:req.body.customerName,
			phone1:req.body.phone1,
			phone2:req.body.phone2
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on('end',function(){
				res.end(body);	
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				console.log("error");
		});
		
		requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//修改客户信息
	router.put('/Customers', function(req, res, next) {
		var urlPath = '/p/Customers'
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'PUT',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		//请求参数
		var data={
			id:req.body.id,
			address:req.body.address,
			company:req.body.company,
			customerName:req.body.customerName,
			phone1:req.body.phone1,
			phone2:req.body.phone2
		};
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on("end", function(){
				res.end(body);
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				//console.log("error");
		});
		
		requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//删除客户信息
	router.delete('/Customers', function(req, res, next) {
		var id = req.query.id
		var urlPath = '/p/Customers'+'/'+id;
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'DELETE',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on("end", function(){
				res.end(body);
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
			//console.log("error");
		});
		requ.end();
    });
	
	//请求域信息页面
	router.get('/domain', function(req, res, next) {
		res.render('domain');
    });
	
	//获取域信息
	router.get('/Domains', function(req, res, next) {
		var id = req.query.id
		var page = req.query.page;
		var per_page = req.query.per_page;
		var urlPath = '/p/Domains';
		if (id!=null){
			urlPath += '/'+id;
		}else{
			urlPath += "?page="+page+"&per_page="+per_page;
		}
		var sessionID = req.headers.authorization;
		console.log(sessionID)
		//console.log(urlPath)
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'GET',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
				reso.on('data', function(d){
					body += d
				});
				reso.on("end",function(){
					//console.log(body)
					res.end(body);
				});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				//console.log("error");
			});
		
		//requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//添加域信息
	router.post('/Domains', function(req, res, next) {
		console.log("domain")
		var urlPath = '/p/Domains'
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'POST',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		//请求参数
		var data={
			domainName:req.body.domainName,
			customer:JSON.parse(req.body.customer),
			adminAccount:JSON.parse(req.body.adminAccount),
			expire:req.body.expire
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on('end',function(){
				//console.log(body)
				res.end(body);	
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				console.log("error");
			});
		
		requ.write(JSON.stringify(data));
		//console.log(JSON.stringify(data))
		requ.end();
    });
	
	//修改域信息
	router.put('/Domains', function(req, res, next) {
		var urlPath = '/p/Domains'
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'PUT',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		//请求参数
		var data={
			id:req.body.id,
			domainName:req.body.domainName,
			expire:req.body.expire,
			customer:JSON.parse(req.body.customer)
		};
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on("end", function(){
				res.end(body);
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				console.log("error");
		});
		requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//删除域信息
	router.delete('/Domains', function(req, res, next) {
		var id = req.query.id
		var urlPath = '/p/Domains'+'/'+id;
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'DELETE',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on("end", function(){
				res.end(body);
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
			//console.log("error");
		});
		requ.end();
    });
	
	//请求用户信息页面
	router.get('/group_account', function(req, res, next) {
		res.render('group_account');
        //adminFunc.renderToManagePage(req, res,'group_account');
    });
	
	//获取用户信息
	router.get('/Accounts', function(req, res, next) {
		var id = req.query.id
		var page = req.query.page;
		var per_page = req.query.per_page;
		var urlPath = '/p/Accounts';
		if (id!=null){
			urlPath += '/'+id;
		}else{
			urlPath += "?page="+page+"&per_page="+per_page;
		}
		var sessionID = req.headers.authorization;
		//console.log(urlPath)
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'GET',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
				reso.on('data', function(d){
					body += d
				});
				reso.on("end",function(){
					//console.log(body)
					res.end(body);
				});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				//console.log("error");
			});
		
		//requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//添加用户信息
	router.post('/Accounts', function(req, res, next) {
		var urlPath = '/p/Accounts'
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'POST',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		//请求参数
		var data={
			domainName:req.body.domainName,
			customer:JSON.parse(req.body.customer),
			adminAccount:JSON.parse(req.body.adminAccount),
			expire:req.body.expire
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on('end',function(){
				//console.log(body)
				res.end(body);	
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				console.log("error");
			});
		
		requ.write(JSON.stringify(data));
		//console.log(JSON.stringify(data))
		requ.end();
    });
	
	//修改用户信息
	router.put('/Accounts', function(req, res, next) {
		var urlPath = '/p/Accounts'
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'PUT',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		//请求参数
		var data={
			id:req.body.id,
			domainName:req.body.domainName,
			expire:req.body.expire,
			customer:JSON.parse(req.body.customer)
		};
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on("end", function(){
				res.end(body);
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				console.log("error");
		});
		requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//删除用户信息
	router.delete('/Accounts', function(req, res, next) {
		var id = req.query.id
		var urlPath = '/p/Accounts'+'/'+id;
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'DELETE',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on("end", function(){
				res.end(body);
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
			//console.log("error");
		});
		requ.end();
    });
	
	//请求联系人信息页面
	router.get('/contact', function(req, res, next) {
		res.render('contact');
        //adminFunc.renderToManagePage(req, res,'contacts');
    });
	
	//获取联系人信息
	router.get('/Contacts', function(req, res, next) {
		console.log("Contacts")
		var id = req.query.id
		var page = req.query.page;
		var per_page = req.query.per_page;
		var urlPath = '/p/Contacts';
		if (id!=null){
			urlPath += '/'+id;
		}else{
			urlPath += "?page="+page+"&per_page="+per_page;
		}
		var sessionID = req.headers.authorization;
		//console.log(urlPath)
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'GET',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
				reso.on('data', function(d){
					body += d
				});
				reso.on("end",function(){
					//console.log(body)
					res.end(body);
				});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				//console.log("error");
			});
		
		//requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//添加联系人信息
	router.post('/Contacts', function(req, res, next) {
		var urlPath = '/p/Contacts'
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'POST',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		//请求参数
		var data={
			domainName:req.body.domainName,
			customer:JSON.parse(req.body.customer),
			adminAccount:JSON.parse(req.body.adminAccount),
			expire:req.body.expire
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on('end',function(){
				//console.log(body)
				res.end(body);	
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				console.log("error");
			});
		
		requ.write(JSON.stringify(data));
		//console.log(JSON.stringify(data))
		requ.end();
    });
	
	//修改联系人信息
	router.put('/Contacts', function(req, res, next) {
		var urlPath = '/p/Contacts'
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'PUT',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		//请求参数
		var data={
			id:req.body.id,
			domainName:req.body.domainName,
			expire:req.body.expire,
			customer:JSON.parse(req.body.customer)
		};
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on("end", function(){
				res.end(body);
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				console.log("error");
		});
		requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//删除联系人信息
	router.delete('/Contacts', function(req, res, next) {
		var id = req.query.id
		var urlPath = '/p/Contacts'+'/'+id;
		var sessionID = req.headers.authorization;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'DELETE',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on("end", function(){
				res.end(body);
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
			//console.log("error");
		});
		requ.end();
    });
	
	//请求黑白名单信息页面
	router.get('/black_white', function(req, res, next) {
		res.render('black_white');
        //adminFunc.renderToManagePage(req, res,'black_white');
    });
	
	
	//请求设备信息页面
	router.get('/device', function(req, res, next) {
		res.render('device');
        //adminFunc.renderToManagePage(req, res,'device');
    });
	
	//获取设备信息
	router.get('/Devices', function(req, res, next) {
		var sessionID = req.headers.authorization;
		var id = req.query.id
		var page = req.query.page;
		var per_page = req.query.per_page;
		var urlPath = '/p/Devices';
		if (id!=null){
			urlPath += '/'+id;
		}else{
			urlPath += "?page="+page+"&per_page="+per_page;
		}
		//console.log(urlPath)
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'GET',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
				reso.on('data', function(d){
					body += d
				});
				reso.on("end",function(){
					console.log(body)
					res.end(body);
				});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				//console.log("error");
			});
		
		//requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//添加设备信息
	router.post('/Devices', function(req, res, next) {
		var urlPath = '/p/Devices'
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'POST',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		//请求参数
		var data={
			domainName:req.body.domainName,
			customer:JSON.parse(req.body.customer),
			adminAccount:JSON.parse(req.body.adminAccount),
			expire:req.body.expire
		};
		var body='';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on('end',function(){
				//console.log(body)
				res.end(body);	
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				console.log("error");
			});
		
		requ.write(JSON.stringify(data));
		//console.log(JSON.stringify(data))
		requ.end();
    });
	
	//修改设备信息
	router.put('/Devices', function(req, res, next) {
		var urlPath = '/p/Devices'
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'PUT',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		//请求参数
		var data={
			id:req.body.id,
			domainName:req.body.domainName,
			expire:req.body.expire,
			customer:JSON.parse(req.body.customer)
		};
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on("end", function(){
				res.end(body);
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
				console.log("error");
		});
		requ.write(JSON.stringify(data));
		requ.end();
    });
	
	//删除设备信息
	router.delete('/Devices', function(req, res, next) {
		var id = req.query.id
		var urlPath = '/p/Devices'+'/'+id;
		//请求路径+请求头
		var opt={
			host:host,
			port:port,
			method:'DELETE',
			path:urlPath,
			headers:{
				'Content-Type':"application/json",
				'Authorization':sessionID
			}
		};
		
		var body = '';
		//发送请求
		var requ = require('http').request(opt, function(reso){
			reso.on('data', function(d){
				body += d;
			});
			reso.on("end", function(){
				res.end(body);
			});
		});
		
		//请求本身失败
		requ.on('error', function(e) {
			//console.log("error");
		});
		requ.end();
    });
	
	//请求角色信息页面
	router.get('/role', function(req, res, next) {
		res.render('role');
        //adminFunc.renderToManagePage(req, res,'device');
    });
	//请求权限信息页面
	router.get('/jurisdiction', function(req, res, next) {
		res.render('jurisdiction');
        //adminFunc.renderToManagePage(req, res,'device');
    });

    return router;
};

module.exports = returnAdminRouter;
