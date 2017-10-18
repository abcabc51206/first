var stscenario = new Stscenario();

var stsId;

$(document).ready(function(){  
	stsId = TDT.getParam("stsId");
	var stsName = TDT.getParam("stsName");
	$("#currStsName").text(stsName);
    stscenario.getStsUserPerm(stsId);
});

function onFocus(){
	$(".search").val("");
}

//关键字查找方案
function search(){
	var keyword = $(".search").val();
	stscenario.searchStsUserPerm(stsId, keyword);
}



function authorizeStsToUser(){
	var userIds = TDT.getIds($("#userList"));
	stscenario.authorizeStsToUser(stsId, userIds);
}