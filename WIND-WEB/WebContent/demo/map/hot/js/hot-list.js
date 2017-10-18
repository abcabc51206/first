 var hot = new Hot();

 $(document).ready(function(){
 	hot.getHotTreeNode();
 	//hot.findAllByPage("root");
 });

  
function search(){
	var key = $(".search").val();
	hot.searchByKey(key);
}

 function delHot(){
 	var ids = TDT.getIds($("#hotList"));
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("删除此数据的同时会删除其下级行政区，您确认删除吗？",function(){
	   		hot.delHot(ids);
   		});
	}
 }
 
  function goViewHot(obj){
 	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("hot-view.html?id="+id);
 }
 
 function goEditHot(obj){
 	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("hot-edit.html?id="+id);
 }
 
 function upToTop(obj){
 	var id = $(obj).parent().parent().attr("rowid");
 	hot.upToTop(id);
 }
 function downToBottom(obj){
 	var id = $(obj).parent().parent().attr("rowid");
 	hot.downToBottom(id);
 }
 function up(obj){
 	var id = $(obj).parent().parent().attr("rowid");
 	hot.up(id);
 }
 function down(obj){
 	var id = $(obj).parent().parent().attr("rowid");
 	hot.down(id);
 }