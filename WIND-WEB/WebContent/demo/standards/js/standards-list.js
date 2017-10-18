var standards = new Standards();

$(document).ready(function(){  
	$(window).resize(function(){
		calTreeHeight();
	});
	standards.getStandardsType();
}); 


function calTreeHeight(){
	$(".standards-panel").height($(".standards-box-table").height()-18)
	//$(".tree-container").height($(".standards-panel").height()-$(".tree-title").height());
}

function goViewStandards(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("standards-view.html?id="+id);
}

function goEditStandards(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("standards-edit.html?id="+id);
}

function downloadFile(obj){
	var fileId = $(obj).parent().parent().attr("fileid");
	if(fileId == "" || fileId == "null"){
		TDT.alert("暂无文件下载！");
		return;
	}
	var url = TDT.getAppPath("")+Standards.url["downloadFile"]+"?fileId="+fileId;
	window.location = url;
}

function delStandards(){
	var ids = TDT.getIds($("#standarDocList"));
	var idsArr = ids.split(",");
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("您确认删除勾选的记录吗？",function(){
	   		standards.deleteStandards(ids);
   		});
	}
}

function search(){
	var keyword = $(".search").val();
	standards.searchStandards(keyword);
}

