var links = new Links();

$(document).ready(function(){  
	$(window).resize(function(){
		calTreeHeight();
	});
	links.getLinksCategoryType();
}); 


function calTreeHeight(){
	$(".links-panel").height($(".links-box-table").height()-18)
	//$(".tree-container").height($(".links-panel").height()-$(".tree-title").height());
}

function goViewLinks(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("links-view.html?id="+id);
}

function goEditLinks(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("links-edit.html?id="+id);
}

function delLinks(){
	var ids = TDT.getIds($("#linksList"));
	var idsArr = ids.split(",");
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("您确认删除勾选的记录吗？",function(){
	   		links.deleteLinks(ids);
   		});
	}
}

function search(){
	var keyword = $(".search").val();
	links.searchLinks(keyword);
}

