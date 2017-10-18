 var sar = new Sar();
 
 $(document).ready(function(){
 	sar.getTreeNode();
 });
 
 function delSar(){
 	var ids = TDT.getIds($("#sarList"));
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("删除此数据的同时会删除其下级行政区，您确认删除吗？",function(){
	   		sar.deleteSar(ids);
   		});
	}
 }
 
 function goViewSar(obj){
 	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("sar-view.html?id="+id);
 }
 
 function goEditSar(obj){
 	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("sar-edit.html?id="+id);
 }
 function searchBykey(){
 	var keyWords = $(".search").val();
 	sar.searchByKey(keyWords);
 }
 function addImpExcel(){
 	art.dialog({
 		title:"行政区划导入",
    	content:$("#addImpExcel").html(),
        fixed: true,
        lock: true
    });
	
 }
 //
function uploadPic(form){
	sar.uploadFile(form);
}



function upToTop(obj){
	var id = $(obj).parent().parent().attr("rowid");
	sar.upToTop(id);
}

function up(obj){
	var id = $(obj).parent().parent().attr("rowid");
	sar.up(id);
}

function down(obj){
	var id = $(obj).parent().parent().attr("rowid");
	sar.down(id);
}

function downToBottom(obj){
	var id = $(obj).parent().parent().attr("rowid");
	sar.downToBottom(id);
}