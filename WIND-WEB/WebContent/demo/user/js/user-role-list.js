var user = new User();
var loginName;

$(document).ready(function(){  
	loginName = TDT.getParam("loginName");
	$("#currUserLoginName").text(loginName);
    user.getUserRole(loginName);
}); 


function authorizeRoleToUser(){
	var roleIds = TDT.getIds($("#userRoleList"));
	if(roleIds == ""){
		TDT.alert("请勾选赋予的角色！");
	}else{
	   	user.authorizeRoleToUser(loginName, roleIds);
	}
}

function authorizePermToRole(obj){
	var roleId = $(obj).parent().parent().attr("rowid");
	var roleName = $(obj).parent().parent().find("td[name='roleName']").text();
	$("#currRoleName").text(roleName);
	var role = new Role();
	role.getPermTree(roleId,"user-role.html?loginName="+loginName);
}




