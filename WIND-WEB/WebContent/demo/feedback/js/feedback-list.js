var feedback = new Feedback();

$(document).ready(function(){  
    feedback.findAllByPage();
}); 

function delFeedback(){
	var ids = TDT.getIds($("#feedbackList"));
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("您确认删除勾选的记录吗？",function(){
	   		feedback.deleteFeedback(ids);
   		});
	}
}

function goViewFeedback(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("feedback-view.html?id="+id);
}

function goReplyFeedback(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("feedback-restore.html?id="+id);
}
function goAudit(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("feedback-audit.html?id="+id);
}

function searchKeyWords(){
	var keyWords = $(".search").val();
	feedback.findByKeyWords(keyWords);
}