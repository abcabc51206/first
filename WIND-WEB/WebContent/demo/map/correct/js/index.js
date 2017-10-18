$(document).ready(function(){
    var _init = function(){Correct.init();};
    Config.init(_init);
    Correct.initView();
  	//读取配置文件
	var sysConf = new Sysconf();
	var allConfValue = sysConf.getAllConf();
	if(allConfValue.length > 0){
		$.each(allConfValue, function(i, data){
			if(data.argsName == "cityConf"){
				var str =data.argsValue;
				var jsonConf =$.evalJSON(str);
				Sysconf.cityInfo=jsonConf;//中心城市坐标信息读取
			} 
		});
	}
    delete _init;	
    
    $(".w").eq(0).show();
	$(".correct-conf-nav span").on("click",function(){
		$(this).siblings().removeClass("correct-conf-select");
		$(this).addClass("correct-conf-select");
		var index=$(".correct-conf-nav span").index(this);
		$(".w").hide();
		$(".w").eq(index).show();
	});
	
	Correct.getCorrectSrvConf();
    
});

function getServiceInfo(){
	var serviceUrl = $("#correct-url").val();
	$("#correct-point-layer").html("");
	$("#correct-line-layer").html("");
	$("#correct-polygon-layer").html("");
	Correct.getLayer(serviceUrl);
}

function saveCorrectConfig(){
	Correct.saveCorrectConfig();
}

function resetCorrectConfig(){
	Correct.resetCorrectConfig();
}