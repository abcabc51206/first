var carConfig = new CarSrvconfig();
$(document).ready(function(){
	$(".table").eq(0).show();
	
	$(".childTable").eq(0).show();
	$("#urltype > input").click(function(){
		var index=$("#urltype > input").index(this);
		$(".childTable").hide();
		$(".childTable").eq(index).show();
	});
	carConfig.getCarSrvConf();
	
});


function saveRouteconfig(){
	carConfig.saveRouteconfig();
}

function resetCarSrvConf(){
	carConfig.resetCarSrvConf();
}
function getRouteServiceInfo(){
	var serviceUrl = $("#rs-url").val();
	$("#rs-layer").html("");
	carConfig.getLayer(serviceUrl);
}

