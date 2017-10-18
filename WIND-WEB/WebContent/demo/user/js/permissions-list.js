var perm = new Permissions();

$(document).ready(function(){  
	$(window).resize(function(){
		perm.calTreeHeight();
	});
	perm.getPermTree();
}); 


function goViewPerm(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("permissions-view.html?id="+id);
}

function goEditPerm(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("permissions-edit.html?id="+id);
}

function delPerm(){
	var ids = TDT.getIds($("#permList"));
	var idsArr = ids.split(",");
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("您确认删除勾选的记录吗？",function(){
	   		perm.deletePermissions(ids);
   		});
	}
}

function search(){
	var keyword = $(".search").val();
	perm.searchPermissions(keyword);
}


function upToTop(obj){
	var id = $(obj).parent().parent().attr("rowid");
	perm.upToTop(id);
}

function up(obj){
	var id = $(obj).parent().parent().attr("rowid");
	perm.up(id);
}

function down(obj){
	var id = $(obj).parent().parent().attr("rowid");
	perm.down(id);
}

function downToBottom(obj){
	var id = $(obj).parent().parent().attr("rowid");
	perm.downToBottom(id);
}