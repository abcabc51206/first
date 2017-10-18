/**
 * 方案添加
 * @author zy
 * @version 1.0 2013/3/5
 */

$(document).ready(function(){
	
	var scenario = new Scenario();
	$(".config-sub input:first").live({
		click:function(){
			scenario.saveUserScenario();
		}
	});
	$("#config-reset").live({
		click:function(){
		TDT.go('../page/scenario.html');
	}
	});
});
var scenario = new Scenario();

//图片上传
function uploadPic(form,type){
	var fileId = $("#file-Id").val();
	if(fileId){
		scenario.updateFile(form,type);
	} else{
		scenario.uploadFile(form,type);
	}
}