var express = require('express');
var router = express.Router();
var mysql=require("../public/javascripts/mysql/mysql.js");

var returnRouter = function(io,domain) {
	//我的设备
	router.get('/', function(req, res) {
		res.render('index',{title:'首页'});
	});

	//我的设备
	router.get('/mydevices', function(req, res) {
		res.render('mydevices',{title:'我的设备'});
	});
	router.post('/mydevices', function(req, res) {
		//绑定设备
	});
	router.delete('/mydevices', function(req, res) {
		//解除绑定
	});
	//某一个设备信息
	router.get('/mydevices/:devicesid', function(req, res) {
		//设备信息
		res.render('devicesinfo',{title:'设备信息'});
	});

	//可看直播
	router.get('/mylives', function(req, res) {
		//mysql.query_delete("SELECT  DISTINCT hashed_id  FROM t_video WHERE TYPE =0 AND author='002'",function(err,vals,fields){
		//	if (err) {
		//		throw err;
		//	}
		//	if(vals) {
		//		var returnValue="";
		//		for (var i = 0; i < vals.length; i++) {
		//			var author=vals[i].hashed_id;
		//			returnValue+='<p><span><a title="直播" href="/mylives/'+author+'">我的'+ author+ '</a></span></p>';
		//		}
		//		res.render('mylives',{title:'可看直播',message:returnValue});
		//	}
		//});

	});
	router.post('/mylives', function(req, res) {
				//绑定可看直播
	});
	router.delete('/mylives', function(req, res) {
		//解除可看直播
	});
	//某一个直播的指导页面
	router.get('/mylives/:taskid', function(req, res) {
		res.render('remoteadvice',{title:'远程指导'});
	});

	//历史纪录列表
	router.get('/myrecords', function(req, res) {
		//mysql.query_delete("SELECT DISTINCT hashed_id,file_name FROM t_video WHERE TYPE =2 AND author='002' AND STATUS = 0",function(err,vals,fields){
		//	if (err) {
		//		throw err;
		//	}
		//	if(vals) {
		//		var returnValue="";
		//		for (var i = 0; i < vals.length; i++) {
		//			var hashed_id=vals[i].hashed_id;
		//			var file_name=vals[i].file_name;
		//			returnValue+='<p><span><a title="纪录" href="/myrecords/'+hashed_id+'">'+
		//				file_name+ '</a></span>' +
		//				'<button  id="delete-'+ hashed_id+'" onclick="deletev(this);" >删除</button>' +
		//				'<button  id="update-'+ hashed_id+'" onclick="updatev(this);"  >改名</button>' +
		//				'<button  id="download-'+ hashed_id+'" onclick="downloadv(this);"  >下载</button>' +
		//				'<button  id="watch-'+ hashed_id+'" onclick="watchv(this);"  >点播</button></p><br/>';
		//		}
		//		res.render('myrecords',{title:'历史纪录',message:returnValue});
		//	}
		//});

	});
	router.delete('/myrecords', function(req, res) {
		var id=req.body.id;
		//mysql.query_delete("UPDATE t_video SET STATUS=1 WHERE hashed_id='"+id+"'",function(err,vals) {
		//	if (err) {
		//		throw err;
		//	}
		//	if (vals) {
		//		if(vals.changedRows>0){
		//			res.send('删除成功！');
		//		}
		//	}
		//});
	});
	//观看历史纪录
	router.get('/myrecords/:taskid', function(req, res) {
		//mysql.query_delete("SELECT url FROM t_video WHERE hashed_id='"+req.params.taskid+"' AND TYPE =2",function(err,vals,fields){
		//	if (err) {
		//		throw err;
		//	}
		//	if(vals) {
		//		var returnValue="";
		//		for (var i = 0; i < vals.length; i++) {
		//			returnValue=vals[i].url;
		//		}
		//		res.render('playrecord',{title:'远程指导',message:returnValue});
		//	}
		//});
	});

	router.get('/myrecords/download/:id',function(req,res){
		//mysql.query_delete("SELECT url FROM t_video WHERE hashed_id='"+req.params.id+"' AND TYPE =2",function(err,vals,fields){
		//	if (err) {
		//		throw err;
		//	}
		//	if(vals) {
		//		var returnValue="";
		//		for (var i = 0; i < vals.length; i++) {
		//			returnValue=vals[i].url;
		//		}
		//		res.send(returnValue);
		//	}
		//});
	});

	router.get('/myrecords/update/:id',function(req,res){
		var name=req.query.name;
		//mysql.query_delete("UPDATE t_video SET file_name='"+name+"' WHERE hashed_id='"+req.params.id+"' AND TYPE =2",function(err,vals,fields){
		//	if (err) {
		//		throw err;
		//	}
		//	if(vals) {
		//		if(vals.changedRows>0){
		//			res.send('修改成功！');
		//		}
		//	}
		//});

	});

	//账单纪录
	router.get('/mybills', function(req, res) {
		res.render('mybills',{title:'账单纪录'});
	});

	//订单纪录
	router.get('/myorders', function(req, res) {
		res.render('myorders',{title:'购买清单'});
	});

	//用户信息
	router.get('/myinfo', function(req, res) {
		res.render('myinfo',{title:'用户信息'});
	});

	//站内好友
	router.get('/myfriends', function(req, res) {
		res.render('myfriends',{title:'站内好友'});
	});


	//注册页面
	router.get('/reg',function(req,res){
		res.render('reg',{
			title:'注册'
		})
	});

	//提交注册
	router.post('/reg',function(req,res){
	});

	//登录页面
	router.get('/login',function(req,res){
		res.render('login',{
			title:'登录'
		});
	});
	//提交登录
	router.post('/login',function(req,res){
	});

	//登出
	router.get('/logout',function(req,res){
		res.redirect('/');//跳转到首页
	});



	return router;
}

module.exports = returnRouter;