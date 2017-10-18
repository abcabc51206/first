var feedback = new Feedback();

$(document).ready(function(){  
	var id = TDT.getParam("id");
    feedback.findById(id);
}); 

function auditSubmit(type){
	var id = $("#feedback-id").val();
	if(type=="pass"){
		$("#feedback-auditStatus").val(2);//审核通过
	}else {
		$("#feedback-auditStatus").val(1); //审核拒绝
		var suggestion = $("#feedback-auditSuggerstion").val();
		if(suggestion ==""){
			TDT.alert("请填写拒绝意见!");
			return;
		}
	}
	
	feedback.updateAudit(id);
}
 
 
 