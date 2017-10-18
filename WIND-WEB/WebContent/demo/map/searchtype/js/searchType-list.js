var searchType = new SearchType();

$(document).ready(function(){
	//searchType.findAllByPage();
	searchType.getTreeNode();
});

function delresearch(){
 	var ids = TDT.getIds($("#searchTypeList"));
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("删除此数据的同时会删除其下级分类，您确认删除吗？",function(){
	   		searchType.deleteSearchType(ids);
   		});
	}
}

function goEditSearchType(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("searchtype-edit.html?id="+id);
}

function goViewSearch(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("searchtype-view.html?id="+id);
}
function searchByKey(){
	var keyWords = $(".search").val();
	searchType.searchByKey(keyWords);
}
 function addImpExcel(){
 	art.dialog({
 		title:"分类搜索导入",
    	content:$("#addImpExcel").html(),
        fixed: true,
        lock: true
    });
 }
 function addImpService(){
 	art.dialog({
 		title:"分类搜索导入",
    	content:$("#addImpService").html(),
        fixed: true,
        lock: true
    });
 }
 //
function uploadPic(form){
	searchType.updateExcelFile(form);
}

function uploadByRUL(form){
	searchType.uploadByRUL(form);
}

function upToTop(obj){
	var id = $(obj).parent().parent().attr("rowid");
	searchType.upToTop(id);
}

function up(obj){
	var id = $(obj).parent().parent().attr("rowid");
	searchType.up(id);
}

function down(obj){
	var id = $(obj).parent().parent().attr("rowid");
	searchType.down(id);
}

function downToBottom(obj){
	var id = $(obj).parent().parent().attr("rowid");
	searchType.downToBottom(id);
}