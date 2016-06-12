function getMenu(){
	var sessionID = $.cookie('sessionID');
	$.ajax({
		type:'GET',
		url:'/p/Functions/Menu',
		async: false,
		dataType:'json',
		headers:{
			'Authorization':sessionID
		},
		success:function(data){
			var returnData = "";
			// returnData = returnData+'<ul class="sidebar-menu">'
			// returnData = returnData+'<li class="treeview active">'
			// returnData = returnData+ '<a ><span><i class="fa fa-user fa-fw"></i>客户管理</span> <i class="fa fa-angle-left pull-right"></i></a>'
			// //returnData = returnData+ '<a href="/p/custom"> 客户基本信息管理</a>'
			// returnData = returnData+ '<ul class="treeview-menu"> '
			// returnData = returnData+ '<li><a href="/p/custom"> 客户基本信息管理</a></li>'
			// returnData = returnData+ '<li><a href="/p/domain"> 客户域管理</a></li>'
			// returnData = returnData+ '</ul>'
			// returnData = returnData+ '</li>'
			// returnData = returnData+'<li class="treeview">'
			// returnData = returnData+ '<a ><span><i class="fa fa-user fa-fw"></i>客户管理</span> <i class="fa fa-angle-left pull-right"></i></a>'
			// //returnData = returnData+ '<a href="/p/custom"> 客户基本信息管理</a>'
			// returnData = returnData+ '<ul class="treeview-menu"> '
			// returnData = returnData+ '<li><a href="/p/custom"> 客户基本信息管理</a></li>'
			// returnData = returnData+ '<li><a href="/p/domain"> 客户域管理</a></li>'
			// returnData = returnData+ '</ul>'
			// returnData = returnData+ '</li>'
			// returnData = returnData+ '</ul>'
			console.log(returnData)
			$("#menu").html(returnData)
			$("#menu").show()
		},
		error:function(){//请求失败
		}
    });
}
