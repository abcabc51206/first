var busConfig = new BusSrvconfig();
$(document).ready(function(){
	$(".table").eq(0).show();
	busConfig.getBusSrvConf();
	
});


function saveBusconfig(){
	busConfig.saveBusconfig();
}

function resetBusconfig(){
	busConfig.resetBusconfig();
}

function getBusServiceInfo(){
	var serviceUrl = $("#bus-url").val();
	$("#bus-layer").val("");
	busConfig.getLayer(serviceUrl);
}

