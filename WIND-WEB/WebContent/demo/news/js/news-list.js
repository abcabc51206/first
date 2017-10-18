var news = new News();

$(document).ready(function(){  
   // news.findAllByPage();
	news.getTreeNode();
}); 

function goViewNews(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("news-view.html?id="+id);
}

function goEditNews(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("news-edit.html?id="+id);
}

function delNews(){
	var ids = TDT.getIds($("#newsList"));
	var idsArr = ids.split(",");
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("您确认删除勾选的记录吗？",function(){
	   		news.deleteNews(ids);
   		});
	}
}



function search(){
	var keyword = $(".search").val();
	news.searchNews(keyword);
}

function upToTop(obj){
	var id = $(obj).parent().parent().attr("rowid");
	news.upToTop(id);
}

function up(obj){
	var id = $(obj).parent().parent().attr("rowid");
	news.up(id);
}

function down(obj){
	var id = $(obj).parent().parent().attr("rowid");
	news.down(id);
}

function downToBottom(obj){
	var id = $(obj).parent().parent().attr("rowid");
	news.downToBottom(id);
}