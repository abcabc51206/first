var org = new Organization();

$(document).ready(function(){  
	$(window).resize(function(){
		org.calTreeHeight();
	});
	org.getOrgTree();
}); 


function goViewOrg(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("organization-view.html?id="+id);
}

function goEditOrg(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("organization-edit.html?id="+id);
}

function delOrg(){
	var ids = TDT.getIds($("#orgList"));
	var idsArr = ids.split(",");
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("您确认删除勾选的记录吗？",function(){
	   		org.deleteOrganization(ids);
   		});
	}
}

function search(){
	var keyword = $(".search").val();
	org.searchOrganization(keyword);
}