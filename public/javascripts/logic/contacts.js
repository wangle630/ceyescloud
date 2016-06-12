//初始化查询所有记录
function contactsinit(){
	//查询数据
	query();
	
	//queryClick();
	
	//add();
	//update();
	//每页显示的条数记录改变
	$("#pagesNum").change(function(){
		per_page = $("#pagesNum").val();
		page = 1
		query();
	});
}


//查询数据
function query(){
	var sessionID = $.cookie('sessionID');
	//查询条件
	//var  = $("");
	custominfo['customerName'] = $("#queryName").val();
	custominfo['company'] = $("#queryCompany").val();
	custominfo['address'] = $("#queryAddress").val();
	var urlPath = '/p/Contacts'+'?page='+page+"&per_page="+per_page
	console.log(urlPath)
	$.ajax({
        	type:'GET',
        	url:urlPath,
        	dataType:'json',
			headers:{
				'Authorization':''+sessionID,
			},
			success:function(data){
				var error = data.error;
				console.log(data)
				if (error.id == 'ok'){
					//所有客户信息
					contactsList = data.data.results;
					//总页数
					totalPages = data.data.totalPages;
					//总的记录数
					totalRecords = data.data.totalRecords;
					queryOper(contactsList);
				}
			},
			error:function(){
				
			}
	});
}

//处理查询结果
function queryOper(contactsList){
	//加载数据
	loadData(contactsList,page,per_page);
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
	   custominfo['address'] = $('#addaddress').val()
	   custominfo['customerName'] = $('#addname').val()
	   custominfo['company'] = $('#addcompany').val()
	   custominfo['phone1'] = $('#addphone1').val()
	   custominfo['phone2'] = $('#addphone2').val()
	   //console.log(custominfo)
	   var sessionID = $.cookie('sessionID');
	   //清空并关闭模态框
	   $('#addaddress').val('');
	   $('#addname').val('');
	   $('#addcompany').val('');
	   $('#addphone1').val('');
	   $('#addphone2').val('');
	   $('#add').attr('data-dismiss','modal');
	   $('#customTable').hide();
        $.ajax({
			type:'POST',
        	url:'/p/Customers',
        	data:custominfo,
        	dataType:'json',
			headers:{
				'Authorization':sessionID,
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
		custominfo['id'] = $('#updateid').val()
		custominfo['address'] = $('#updateaddress').val()
		custominfo['customerName'] = $('#updatename').val()
		custominfo['company'] = $('#updatecompany').val()
		custominfo['phone1'] = $('#updatephone1').val()
		custominfo['phone2'] = $('#updatephone2').val()
		//清空并关闭模态框
	   $('#updateid').val('');
	   $('#updateaddress').val('');
	   $('#updatecompany').val('');
	   $('#updatephone1').val('');
	   $('#updatephone2').val('');
	   $('#update').attr('data-dismiss','modal');
		var sessionID = $.cookie('sessionID');
        $.ajax({
        	type:'PUT',
        	url:'/p/Customers',
        	data:custominfo,
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

        	}
       	});
	});
}


function loadData(contactsList,page,per_page){
	$('#customTable').empty();
	var len = contactsList.length
	var returnData = "";
	for(var i = 0;i < len; i++){
		returnData = returnData+ '<tr>';
		//returnData = returnData + ' <td><input type="checkbox" class="checkClass" id="'+i+'"></input></td>';
		//returnData = returnData + '<td class="id">'+contactsList[i].id+'</td>';	
		returnData = returnData + '<td class="customerName">'+contactsList[i].customerName+'</td>';	
		returnData = returnData + '<td class="company">'+contactsList[i].company+'</td>';	
		returnData = returnData + '<td class="address">'+contactsList[i].address+'</td>';	
		returnData = returnData + '<td class="phone1">'+contactsList[i].phone1+'</td>';	
		returnData = returnData + '<td class="phone2">'+contactsList[i].phone2+'</td>';	
		returnData = returnData + '<td class="created">'+contactsList[i].created+'</td>';	
		returnData = returnData + '<td class="updated">'+contactsList[i].updated+'</td>';	
		
		returnData = returnData + '<td><button class="btn btn-primary btn-xs updateCustom" id="'+i+'" data-toggle="modal" data-target="#updateCustomPanel" type="button" title="编辑" ><i class="fa fa-edit"></i></button>';
		returnData = returnData + '<button class="btn btn-default btn-xs deleteCustom" id="delete'+i+'" type="button" title="删除" ><i class="fa fa-trash-o"></i></button></td>';
		returnData = returnData + '<td><button id="detial'+i+'"class="btn btn-primary  btn-xs detailCustom" data-toggle="modal" data-target="#detialCustomPanel"  type="button">查看详情</button></td>';
		returnData = returnData+ '</tr>';
	}
	$('#customTable').append(returnData)	
	$('#customTable').show();
	updateDataInfo(contactsList);
	detailDataInfo(contactsList);
	deleteDataInfo(contactsList)
	
	
	//delet();
}

function updateDataInfo(contactsList){
	$(".updateCustom").click(function(){
		var i = $(this).attr('id')
		$("#updateid").val(contactsList[i].id);
		$("#updatename").val(contactsList[i].customerName);
		$("#updatecompany").val(contactsList[i].company);
		$("#updateaddress").val(contactsList[i].address);
		$("#updatephone1").val(contactsList[i].phone1);
		$("#updatephone2").val(contactsList[i].phone2);
	});
}

//查看客户详情
function detailDataInfo(contactsList){
	$(".detailCustom").click(function(){
		var sessionID = $.cookie('sessionID');
		var id = $(this).attr('id')
		var i = parseInt(id.substring(6))
		//custominfo['customId'] = contactsList[i].id;
        $.ajax({
        	type:'GET',
        	url:'/p/Customers'+"?id="+contactsList[i].id,
        	//data:custominfo,
        	dataType:'json',
			headers:{
				'Authorization':''+sessionID,
			},
        	success:function(data){
				var error = data.error;
				var contactsList = data.data;
				if (error.id=='ok'){
					$("#detialid").empty();
					$("#detialname").empty();
					$("#detialcompany").empty();
					$("#detialaddress").empty();
					$("#detialphone1").empty();
					$("#detialphone2").empty();
					$("#detialcreated").empty();
					$("#detialupdated").empty();
					$("#detialid").append(contactsList.id);
					$("#detialname").append(contactsList.customerName);
					$("#detialcompany").append(contactsList.company);
					$("#detialaddress").append(contactsList.address);
					$("#detialphone1").append(contactsList.phone1);
					$("#detialphone2").append(contactsList.phone2);
					$("#detialcreated").append(contactsList.phone2);
					$("#detialupdated").append(contactsList.phone2);
				}
        	},
        	error:function(){

        	}
       	});
	});
}

//单个删除客户信息
function deleteDataInfo(contactsList){
	$(".deleteCustom").click(function(){
		var sessionID = $.cookie('sessionID');
		var id = $(this).attr('id')
		var i = parseInt(id.substring(6))
		$.ajax({
        	type:'DELETE',
        	url:'/p/Customers'+"?id="+contactsList[i].id,
        	//data:queryCustominfo,
        	dataType:'json',
			headers:{
				'Authorization':''+sessionID,
			},
        	success:function(data){
        		var error = data.error;
				if (error.id=='ok'){
					//添加自动消失的删除成功对话框
					$("#msg").show();
					$("#msg").html("删除成功").fadeTo(3000).hide(); 
					query();
				}
        	},
        	error:function(){

        	}
       	});
	});
}

