

function login(){
	$("#login").click(function(){
	   userinfo['username'] = $('#username').val()
	   userinfo['password'] = $('#password').val()
       $.ajax({
        	type:'POST',
        	url:'/p/validate',
        	data:userinfo,
        	dataType:'json',
        	success:function(data){
			var error = data.error;
			var data = data.data;
			if(error.id == 'ok'){//验证通过
				//console.log(data.data);
				var sessionID = data.sessionID;
				//var cookietime = new Date(); 
				//cookietime.setTime(date.getTime() + (60 * 60 * 1000));//coockie保存一小时
				$.cookie('sessionID', sessionID,{expires:1,path:'/'});
				//获取菜单信息
				location.href='/p/manage'
			}//验证失败
			else{
				location.href='/p'
					
	      	        }
        	},
        	error:function(){//请求失败
				console.log('error')
        	}
       	});
	});
}