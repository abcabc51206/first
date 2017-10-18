var demoApp = new DemoApp();

$(document).ready(function(){  
    demoApp.findAllByPage();
}); 

function goViewDemoApp(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("demoapp-view.html?id="+id);
}

function goEditDemoApp(obj){
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("demoapp-edit.html?id="+id);
}

function delDemoApp(){
	var ids = TDT.getIds($("#demoAppList"));
	var idsArr = ids.split(",");
	if(ids == ""){
		TDT.alert("请勾选删除项！");
	}else{
   		TDT.confirm("您确认删除勾选的记录吗？",function(){
	   		demoApp.deleteDemoApp(ids);
   		});
	}
}



function search(){
	var key = $(".search").val();
	demoApp.searchDemoApp(key);
}

function upToTop(obj){
	var id = $(obj).parent().parent().attr("rowid");
	demoApp.upToTop(id);
}

function up(obj){
	var id = $(obj).parent().parent().attr("rowid");
	demoApp.up(id);
}

function down(obj){
	var id = $(obj).parent().parent().attr("rowid");
	demoApp.down(id);
}

function downToBottom(obj){
	var id = $(obj).parent().parent().attr("rowid");
	demoApp.downToBottom(id);
}