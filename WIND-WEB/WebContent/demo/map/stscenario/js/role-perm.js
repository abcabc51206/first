var stscenario = new Stscenario();

var stsId;

$(document).ready(function(){  
	stsId = TDT.getParam("stsId");
	var stsName = TDT.getParam("stsName");
	$("#currStsName").text(stsName);
    stscenario.getStsRolePerm(stsId);
});

function onFocus(){
	$(".search").val("");
}

//关键字查找方案
function search(){
	var keyword = $(".search").val();
	stscenario.searchStsRolePerm(stsId, keyword);
}



function authorizeStsToRole(){
	var roleIds = TDT.getIds($("#roleList"));
	stscenario.authorizeStsToRole(stsId, roleIds);
}