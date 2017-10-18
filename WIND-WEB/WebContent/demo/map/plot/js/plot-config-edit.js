var plotConfig = new PlotSrvconfig();

$(document).ready(function(){
	$(".a").eq(0).show();
	
	$(".table").eq(0).show();
	$(".plotconfig-nav span").click(function(){
		$(this).siblings().removeClass("plotconfig-select");
		$(this).addClass("plotconfig-select");
		var index=$(".plotconfig-nav span").index(this);
		$(".table").hide();
		$(".table").eq(index).show();
	});
	
	plotConfig.getPlotSrvConf();
	
});

function getServiceInfo(){
	var serviceUrl = $("#plot-url").val();
	$("#plot-point-layer").html("");
	$("#plot-line-layer").html("");
	$("#plot-polygon-layer").html("");
	plotConfig.getLayer(serviceUrl);
}

function savePlotConfig(){
	plotConfig.savePlotConfig();
}

function resetPlotSrvConf(){
	plotConfig.resetPlotSrvConf();
}
