/**
 * 方案添加
 * @author zy
 * @version 1.0 2013/3/5
 */
var scenario = new Scenario();
$(document).ready(function(){
	
	var id = TDT.getParam("id");
    $("#scenario-id").val(id);
	
	scenario.findScenarioById(id);
    
	$(".config-sub_ input:first").live({
		click:function(obj){
			scenario.editScenario(obj);
		}
	});
	$("#config-reset").live({
		click:function(){
		TDT.go('../page/scenario.html');
	}
	});
});

//图片上传
function uploadPic(form,type){
	var fileId = $("#file-Id").val();
	if(fileId){
		scenario.updateFile(form,type);
	} else{
		scenario.uploadFile(form,type);
	}
}

