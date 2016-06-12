function bind(){
	
}

//初始化查询所有记录
function deviceinit(){
	//查询数据
	query();
	//每页显示的条数记录改变
	$("#pagesNum").change(function(){
		per_page = $("#pagesNum").val();
		page = 1
		query();
	});
	$('#deviceTable').hide();
	queryClick();
}

//查询数据
function query(){
	var sessionID = $.cookie('sessionID');
	//查询条件
	//var  = $("");
	
	var urlPath = '/p/Devices'+'?page='+page+"&per_page="+per_page
	$.ajax({
        	type:'GET',
        	url:urlPath,
        	dataType:'json',
			headers:{
				'Authorization':sessionID
			},
			success:function(data){
				console.log(data)
				var error = data.error;
				if (error.id == 'ok'){
					//所有客户信息
					var deviceList = data.data.results;
					//总页数
					totalPages = data.data.totalPages;
					//总的记录数
					var totalRecords = data.data.totalRecords;
					queryOper(deviceList,totalRecords);
				}
			},
			error:function(){
				
			}
	});
}

//处理查询结果
function queryOper(deviceList,totalRecords){
	//加载数据
	loadData(deviceList,page,per_page);
	//分页
	var options = ""
	options += "<li id='first'><a href='#' style='height:30px;line-height:30px;font-size:16px;'>first</a></li>";
	options += "<li id='prev'><a href='#' style='height:30px;line-height:30px;font-size:16px;'>prev</a></li>";
	options += "<li><a href='#' style='height:30px;line-height:30px;font-size:16px;'><input id='currentPage' type='text' value="+page+"  style='margin-top:-15px;height:26px;width:35px;text-align:center'/></a></li>"
	options += "<li id='next'><a href='#' style='height:30px;line-height:30px;font-size:16px;'>next</a></li>"
	options += "<li id='last'><a href='#' style='height:30px;line-height:30px;font-size:16px;'>last</a></li>";
	$('#pages').empty();
	$('#pages').append(options);
	
	$('#sum').empty();
	$('#sum').append(",共有记录"+totalRecords+"条")
	pageChange();
}

//分页值改变
function pageChange(){
	//上一页
	$("#prev").click(function(){
		$("#currentPage").val((parseInt($("#currentPage").val())-1)<=0?1:(parseInt($("#currentPage").val())-1));
		//当前页
		page = $("#currentPage").val();
		query()
	});
	//下一页
	$("#next").click(function(){
		$("#currentPage").val(parseInt((parseInt($("#currentPage").val())+1))>=parseInt(totalPages)?parseInt(totalPages):(parseInt($("#currentPage").val())+1));
		//当前页
		page = $("#currentPage").val();
		query()
	});
	
	//第一页
	$("#first").click(function(){
		$("#currentPage").val(parseInt(1));
		//当前页
		page = $("#currentPage").val();
		query()
	});
	//最后一页
	$("#last").click(function(){
		$("#currentPage").val(parseInt(totalPages));
		//当前页
		page = $("#currentPage").val();
		query()
	});
	
	//手动输入页数
	$("#currentPage").change(function(){
		//当前页
		page = $("#currentPage").val();
		query()
	});
}

function queryClick(){
	$("#query").click(function(){
		page = 1;
		query();
	});
}



function loadData(deviceList,page,per_page){
	$('#deviceTable').empty();
	var len = deviceList.length
	var returnData = "";
	for(var i = 0;i < len; i++){
		var account = deviceList[i].account;
		var accountId = "";
		var accountName = "";
		if (account!=null){
			accountId = account.id;
			accountName = account.accountName;
		}
		returnData = returnData+ '<tr>';
		//returnData = returnData + ' <td><input type="checkbox" class="checkClass" id="'+i+'"></input></td>';
		//returnData = returnData + '<td class="id">'+deviceList[i].id+'</td>';	
		returnData = returnData + '<td class="type">'+deviceList[i].deviceType+'</td>';	
		returnData = returnData + '<td class="state">'+deviceList[i].deviceState+'</td>';	
		returnData = returnData + '<td class="accountId">'+accountId+'</td>';
		returnData = returnData + '<td class="accountName">'+accountName+'</td>';
		returnData = returnData + '<td class="sipAccount">'+deviceList[i].sipAccount+'</td>';
		returnData = returnData + '<td class="enable">'+deviceList[i].enable+'</td>';
		returnData = returnData + '<td class="created">'+deviceList[i].created+'</td>';
		returnData = returnData + '<td class="updated">'+deviceList[i].updated+'</td>';
		returnData = returnData + '<td><button class="btn btn-primary  btn-xs cutDevice" type="button" style="margin-right:2px">解除绑定</button>';
		returnData = returnData + '<button class="btn btn-primary  btn-xs confDevice" type="button">设备配置</button></td>';
		returnData = returnData + '<td><button id="detial'+i+'"class="btn btn-primary  btn-xs detailDevice" data-toggle="modal" data-target="#detialDevicePanel"  type="button">查看详情</button></td>';
		returnData = returnData+ '</tr>';
	}
	$('#deviceTable').append(returnData)	
	$('#deviceTable').show();
	detailDataInfo(deviceList);
	
	
	//delet();
}


//查看设备详情
function detailDataInfo(deviceList){
	$(".detailDevice").click(function(){
		var sessionID = $.cookie('sessionID');
		var id = $(this).attr('id')
		var i = parseInt(id.substring(6))
		//custominfo['customId'] = customList[i].id;
        $.ajax({
        	type:'GET',
        	url:'/p/Devices'+"?id="+deviceList[i].id,
        	//data:custominfo,
        	dataType:'json',
			headers:{
				'Authorization':''+sessionID,
			},
        	success:function(data){
				var error = data.error;
				var deviceList = data.data;
				if (error.id=='ok'){
					$("#detialid").empty();
					$("#detialtype").empty();
					$("#detialstate").empty();
					$("#detialaccountId").empty();
					$("#detialaccountName").empty();
					$("#detialsip").empty();
					$("#detialenable").empty();
					$("#detialcreated").empty();
					$("#detialupdated").empty();
					
					var account = deviceList.account
					var accountid = (account != null)?account.id:null
					var accountName = (account != null)?account.accountName:null
					
					$("#detialid").append(deviceList.id);
					$("#detialtype").append(deviceList.deviceType);
					$("#detialstate").append(deviceList.deviceState);
					$("#detialaccountId").append(accountid);
					$("#detialaccountName").append(accountName);
					$("#detialsip").append(deviceList.sipAccount);
					$("#detialenable").append(deviceList.enable);
					$("#detialcreated").append(deviceList.created);
					$("#detialupdated").append(deviceList.updated);
				}
        	},
        	error:function(){

        	}
       	});
	});
}

