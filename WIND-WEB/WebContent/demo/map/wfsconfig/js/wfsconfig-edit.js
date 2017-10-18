var wfsconfig = new Wfsconfig();
$(document).ready(function(){
	var searchType1 = new SearchType("st-first",0);
	var searchType2 = new SearchType("st-second",1);
	var searchType3 = new SearchType("st-third",2);
	$(".a").eq(0).show();
	
	$(".field tr").click(function(){
		$(this).addClass("children-select");
	})
	$(".field tr:even td").css("background","#f0f4f7");
	
	$(".table").eq(0).show();
	
	var type = TDT.getParam("type");
	$("#wfsconfig-srvType").val(type);
	
	wfsconfig.initData(type);
	
});


function checkService(){
	var serviceUrl = $("#srvURL").val();
	$("#wfsconfig-srvURL").val("");
	wfsconfig.checkURL(serviceUrl);
}


function saveWfsconfig(){
	wfsconfig.updateForm();
}
