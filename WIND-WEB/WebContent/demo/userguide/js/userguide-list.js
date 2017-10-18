var userguide = new Userguide();

$(document).ready(function(){  
   // userguide.findAllByPage("用户指南");
    userguide.getTreeNode();
}); 

function goViewUserguide(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("userguide-view.html?id="+id);
}

function goEditUserguide(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("userguide-edit.html?id="+id);
}

function delUserguide(){
	var ids = TDT.getIds($("#userguideList"));
	var idsArr = ids.split(",");
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("您确认删除勾选的记录吗？",function(){
	   		userguide.deleteUserguide(ids);
   		});
	}
}



function search(){
	var keyword = $(".search").val();
	userguide.searchUserguide(keyword);
}

function upToTop(obj){
	var id = $(obj).parent().parent().attr("rowid");
	userguide.upToTop(id);
}

function up(obj){
	var id = $(obj).parent().parent().attr("rowid");
	userguide.up(id);
}

function down(obj){
	var id = $(obj).parent().parent().attr("rowid");
	userguide.down(id);
}

function downToBottom(obj){
	var id = $(obj).parent().parent().attr("rowid");
	userguide.downToBottom(id);
}