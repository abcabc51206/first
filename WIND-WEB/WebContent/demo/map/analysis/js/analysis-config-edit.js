var analysisConfig = new AnalysisSrvconfig();

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
	
	analysisConfig.getAnalysisSrvConf();
	
});


function saveAnalysisConfig(){
	analysisConfig.saveAnalysisConfig();
}

function resetAnalysisSrvConf(){
	analysisConfig.resetAnalysisSrvConf();
}
