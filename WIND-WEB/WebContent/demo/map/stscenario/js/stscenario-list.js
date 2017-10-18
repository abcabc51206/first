/**
 * 方案配置模块对象
 * @author zy
 * @version 1.0 2013/3/6
 */
var stscenario = new Stscenario();

var currSceType;

$(document).ready(function(){  
    stscenario.findMySpecialTopicScenario();
});
function onFocus(){
	$(".search").val("");
}

//关键字查找方案
function search(){
	var keyword = $(".search").val();
	stscenario.searchMySpecialTopicScenario(keyword);
}

//用户权限
function userPerm(obj){
	var id = $(obj).parent().parent().attr("rowid");
	var stsName = $(obj).parent().parent().attr("stsName");
	TDT.go("user-perm.html?stsId="+id+"&stsName="+stsName);
}

//角色权限
function rolePerm(obj){
	var id = $(obj).parent().parent().attr("rowid");
	var stsName = $(obj).parent().parent().attr("stsName");
	TDT.go("role-perm.html?stsId="+id+"&stsName="+stsName);
}

//机构权限
function orgPerm(obj){
	var id = $(obj).parent().parent().attr("rowid");
	var stsName = $(obj).parent().parent().find("td[name='stsName']").text();
	$("#currStsName").text(stsName);
	stscenario.getStsOrgPermTree(id);
}



