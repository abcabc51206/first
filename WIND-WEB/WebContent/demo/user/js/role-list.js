var role = new Role();

$(document).ready(function(){  
    role.findAllByPage();
}); 

function goEditRole(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("role-edit.html?id="+id);
}

function goViewRole(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("role-view.html?id="+id);
}

function delRole(){
	var ids = TDT.getIds($("#roleList"));
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
		if(ids.indexOf("10001") != -1 || ids.indexOf("10002") != -1  || ids.indexOf("10003") != -1 ){
			TDT.alert("系统默认角色（匿名用户、普通用户、系统管理员）不允许删除！");
		} else {
	   		TDT.confirm("您确认删除勾选的记录吗？",function(){
		   		role.delRole(ids);
	   		});
   		}
	}
}

function authorizePermToRole(obj){
	var roleId = $(obj).parent().parent().attr("rowid");
	var roleName = $(obj).parent().parent().find("td[name='roleName']").text();
	$("#currRoleName").text(roleName);
	role.getPermTree(roleId, "role.html");
}

function search(){
	var keyWords = $(".search").val();
	role.searchByKey(keyWords);
}



