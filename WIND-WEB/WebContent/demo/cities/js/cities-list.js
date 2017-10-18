var cities = new Cities();

$(document).ready(function(){  
    cities.findAllByPage();
}); 

function goViewCities(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("cities-view.html?id="+id);
}

function goEditCities(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("cities-edit.html?id="+id);
}

function delCities(){
	var ids = TDT.getIds($("#citiesList"));
	var idsArr = ids.split(",");
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("您确认删除勾选的记录吗？",function(){
	   		cities.deleteCities(ids);
   		});
	}
}



function search(){
	var key = $(".search").val();
	cities.searchCities(key);
}

function upToTop(obj){
	var id = $(obj).parent().parent().attr("rowid");
	cities.upToTop(id);
}

function up(obj){
	var id = $(obj).parent().parent().attr("rowid");
	cities.up(id);
}

function down(obj){
	var id = $(obj).parent().parent().attr("rowid");
	cities.down(id);
}

function downToBottom(obj){
	var id = $(obj).parent().parent().attr("rowid");
	cities.downToBottom(id);
}