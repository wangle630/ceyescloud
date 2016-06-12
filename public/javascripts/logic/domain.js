//初始化查询所有记录
function domaininit(){
	//查询数据
	query();
	queryCustom();
	//每页显示的条数记录改变
	$("#pagesNum").change(function(){
		per_page = $("#pagesNum").val();
		page = 1
		domainquery();
	});
	$('#domainTable').hide();
	add();
	queryClick();
	update();
	//处理查询结果
	//queryOper();
}

//查询数据
function query(){
	var sessionID = $.cookie('sessionID');
	//查询条件
	//var  = $("");
	
	var urlPath = '/p/Domains'+'?page='+page+"&per_page="+per_page
	$.ajax({
        	type:'GET',
        	url:urlPath,
        	dataType:'json',
			headers:{
				'Authorization':sessionID
			},
			success:function(data){
				var error = data.error;
				
				
				if (error.id == 'ok'){
					//所有客户信息
					var domainList = data.data.results;
					//总页数
					totalPages = data.data.totalPages;
					//总的记录数
					var totalRecords = data.data.totalRecords;
					queryOper(domainList,totalRecords);
				}
			},
			error:function(){
				
			}
	});
}

//处理查询结果
function queryOper(domainList,totalRecords){
	//加载数据
	loadData(domainList,page,per_page);
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

function add(){
	$("#add").click(function(){
	   domaininfo['domainName'] = $('#addName').val()
	   customer["id"] = $('#addCustomId').val()
	   domaininfo['customer'] = JSON.stringify(customer)
	   adminAccount['accountName'] = $('#addAccountName').val()
	   adminAccount['password'] = $('#addAccountPassword').val()
	   domaininfo['adminAccount'] = JSON.stringify(adminAccount)
	   domaininfo['expire'] = $('#addExpired').val()
	   //console.log(domaininfo)
	   var sessionID = $.cookie('sessionID');
	   //清空并关闭模态框
	   $('#addName').val('');
	   //$('#selectCustomId').val('');
	   $('#addAcountId').val('');
	   $('#addExpired').val('');
	   $('#add').attr('data-dismiss','modal');
	   $('#domainTable').hide();
	
        $.ajax({
			type:'POST',
        	url:'/p/Domains',
        	data:domaininfo,
        	dataType:'json',
			headers:{
				'Authorization':''+sessionID,
			},
        	success:function(data){
				var error = data.error;
				var data = data.data;
				if(error.id == 'ok'){
					page = 1;
					query();
				}
        	},
        	error:function(data){
        		console.log('error');

        	}
       	    });
	});
}

function update(){
	$("#update").click(function(){
		var sessionID = $.cookie('sessionID');
		domaininfo['id'] = $('#updateid').val()
		domaininfo['domainName'] = $('#updatename').val()
		customer['id'] = $('#updateCustomId').val()
		domaininfo['customer'] = JSON.stringify(customer)
		domaininfo['expire'] = $('#updateexpried').val()
		//清空并关闭模态框
	   $('#updateid').val('');
	   $('#updateName').val('');
	   //$('#selectCustomId').val('');
	   $('#updateAcountId').val('');
	   $('#updateExpired').val('');
	   $('#update').attr('data-dismiss','modal');
		var sessionID = $.cookie('sessionID');
        $.ajax({
        	type:'PUT',
        	url:'/p/Domains',
        	data:domaininfo,
        	dataType:'json',
			headers:{
				'Authorization':''+sessionID,
			},
        	success:function(data){
				var error = data.error;
				var data = data.data.results;
        		if(error.id == 'ok'){
					page = 1;
					query();
				}
        	},
        	error:function(){
				console.log("error")
        	}
       	});
	});
}


function loadData(domainList,page,per_page){
	$('#domainTable').empty();
	var len = domainList.length
	var returnData = "";
	for(var i = 0;i < len; i++){
		//console.log(domainList[i].adminAccount)
		var account = domainList[i].adminAccount
		var customer = domainList[i].customer
		var accountid = null;
		var customerid = null;
		accountid = (account != null)?account.id:null
		customerid = (customer != null)?customer.id:null
		returnData = returnData+ '<tr>';
		//returnData = returnData + ' <td><input type="checkbox" class="checkClass" id="'+i+'"></input></td>';
		returnData = returnData + '<td class="id">'+domainList[i].id+'</td>';	
		returnData = returnData + '<td class="customerName">'+domainList[i].domainName+'</td>';	
		returnData = returnData + '<td class="phone1">'+customerid+'</td>';	
		returnData = returnData + '<td class="company">'+accountid+'</td>';	
		returnData = returnData + '<td class="phone2">'+domainList[i].expired+'</td>';	
		returnData = returnData + '<td class="created">'+domainList[i].created+'</td>';	
		returnData = returnData + '<td class="updated">'+domainList[i].updated+'</td>';	
		
		returnData = returnData + '<td><button class="btn btn-primary btn-xs updateDomain" id="'+i+'" data-toggle="modal" data-target="#updateDomainPanel" type="button" title="编辑" ><i class="fa fa-edit"></i></button>';
		returnData = returnData + '<button class="btn btn-default btn-xs deleteDomain" id="delete'+i+'" type="button" title="删除" ><i class="fa fa-trash-o"></i></button></td>';
		returnData = returnData + '<td><button id="detial'+i+'"class="btn btn-primary  btn-xs detailCustom" data-toggle="modal" data-target="#detialDomainPanel"  type="button">查看详情</button></td>';
		returnData = returnData+ '</tr>';
	}
	$('#domainTable').append(returnData)	
	$('#domainTable').show();
	updateDataInfo(domainList);
	detailDataInfo(domainList);
	deleteDataInfo(domainList)
	
	
	//delet();
}

function updateDataInfo(domainList){
	$(".updateDomain").click(function(){
		var i = $(this).attr('id')
		$("#updateid").val(domainList[i].id);
		$("#updatename").val(domainList[i].domainName);
		$("#updateexpried").val(domainList[i].expired);
		//console.log(domainList[i].customer)
		var customer = domainList[i].customer
		var customerid = null;
		customerid = (customer != null)?customer.id:null
		$("#updateCustomId").val(customerid);
	});
}

//查看客户详情
function detailDataInfo(domainList){
	$(".detailCustom").click(function(){
		var sessionID = $.cookie('sessionID');
		var id = $(this).attr('id')
		var i = parseInt(id.substring(6))
		//custominfo['customId'] = customList[i].id;
        $.ajax({
        	type:'GET',
        	url:'/p/Domains'+"?id="+domainList[i].id,
        	//data:custominfo,
        	dataType:'json',
			headers:{
				'Authorization':''+sessionID,
			},
        	success:function(data){
				var error = data.error;
				var domainList = data.data;
				if (error.id=='ok'){
					$("#detialid").empty();
					$("#detialname").empty();
					$("#detialcustomerId").empty();
					$("#detialaccountId").empty();
					$("#detialexpried").empty();
					$("#detialcreated").empty();
					$("#detialupdated").empty();
					
					var account = domainList.adminAccount
					var customer = domainList.customer
					var accountid = null;
					var customerid = null;
					accountid = (account != null)?account.id:null
					customerid = (customer != null)?customer.id:null
					$("#detialid").append(domainList.id);
					$("#detialname").append(domainList.domainName);
					$("#detialcustomerId").append(customerid);
					$("#detialaccountId").append(accountid);
					$("#detialexpried").append(domainList.expired);
					$("#detialcreated").append(domainList.created);
					$("#detialupdated").append(domainList.updated);
				}
        	},
        	error:function(){

        	}
       	});
	});
}

//单个删除客户信息
function deleteDataInfo(domainList){
	$(".deleteDomain").click(function(){
		var sessionID = $.cookie('sessionID');
		var id = $(this).attr('id')
		var i = parseInt(id.substring(6))
		$.ajax({
        	type:'DELETE',
        	url:'/p/Domains'+"?id="+domainList[i].id,
        	//data:queryCustominfo,
        	dataType:'json',
			headers:{
				'Authorization':''+sessionID,
			},
        	success:function(data){
        		var error = data.error;
				if (error.id=='ok'){
					//添加自动消失的删除成功对话框
					query();
				}
        	},
        	error:function(){

        	}
       	});
	});
}


//查询客户Id数据
function queryCustom(){
	var sessionID = $.cookie('sessionID');
	var urlPath = '/p/Customers'
	$.ajax({
        	type:'GET',
        	url:urlPath,
        	dataType:'json',
			headers:{
				'Authorization':''+sessionID,
			},
			success:function(data){
				var error = data.error;
				
				
				if (error.id == 'ok'){
					//所有客户信息
					var customList = data.data.results;
					//总的记录数
					var totalRecord = data.data.totalRecords;
					handleCustomId(customList,totalRecord);
				}
			},
			error:function(){
				
			}
	});
}

//处理客户Id
function handleCustomId(customList,totalRecord){
	var optionData="";
	for (var i=0;i<totalRecord;i++){
		optionData += '<option value="'+customList[i].id+'">'+customList[i].id+'</option>';
	}
	$("#addCustomId").append(optionData)
	$("#updateCustomId").append(optionData)
}
