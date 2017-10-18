var user = new User();

$(document).ready(function(){  
    user.findAllByPage();
}); 

function goViewUser(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("user-view.html?id="+id);
}

function goEditUser(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("user-edit.html?id="+id);
}

function delUser(){
	var ids = TDT.getIds($("#userList"));
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
		if(ids.indexOf("10001") != -1){
			TDT.alert("系统超级管理员admin不允许删除！");
		} else {
	   		TDT.confirm("您确认删除勾选的用户吗？",function(){
		   		user.deleteUser(ids);
	   		});
   		}
	}
}

function initializePwd(){
	var ids = TDT.getIds($("#userList"));
	if(ids == ""){
		TDT.alert("请勾选需要初始化密码的用户！");
	}else{
   		TDT.confirm("您确认为勾选的用户初始化密码吗？",function(){
	   		user.initializePwd(ids);
   		});
	}
}

function enabledUser(obj){
	var userId = $(obj).parent().parent().attr("rowid");
	user.enabledUser(userId);
}

function disabledUser(obj){
	var userId = $(obj).parent().parent().attr("rowid");
	user.disabledUser(userId);
}

function goViewRolePerm(obj){
	var loginName = $(obj).parent().parent().find("td[name='loginName']").text();
	TDT.go("user-role.html?loginName="+loginName);
}


function goViewUserPerm(obj){
	var loginName = $(obj).parent().parent().find("td[name='loginName']").text();
	$("#currLoginName").text(loginName);
	user.getPermTree(loginName);
}

function search(){
	var key = $(".search").val();
	user.searchUser(key);
}

