/*
 * 读取配置
 */
var Config  ={
	proxyUrl:"/portal/proxyHandler?url=",
	url:{
		getGenericConfigUrl:"sysconf/findAllByPage.do"
		//getWfsConfigUrl:"wfsConfig/queryEntityByType.do"
	},
	_GenericConfig:{
		wrongSrvConf:"wrongSrvConf",
		cityConf:"cityConf"
		//markConf:"markConf",
		//routeSrvConf:"routeSrvConf",
		//busSrvConf:"busSrvConf"
	},
	initGenericConfigEnd:false,
	initPlaceNameConfigEnd:false,
	initCarConfigEnd:false,
	initRouteConfigEnd:false,
	// 初始化 通用配置
	initGenericConfig:function(successFN){
			var url = Config.url["getGenericConfigUrl"];
			var params = "pageNum=1&pageSize=100000";
			var allConfValue;
			TDT.getDS(url,params,false,function(json){
				if(json.result){
					allConfValue = json.sysconfList;
					for(var m = 0; m < allConfValue.length;m++){
						var index = 0
						$.each( Config._GenericConfig, function(i, n){
						  if(n==allConfValue[m].argsName){
						  	if(allConfValue[m].argsValue.indexOf("{") == 0){
						  	   Config[i] = $.evalJSON(allConfValue[m].argsValue);
						  	}else{
						  	   Config[i] = allConfValue[m].argsValue;
						  	}
						  	delete Config._GenericConfig[i];
						  }
						  index++;
						});
						if(index == 0){
							break;
						}
					}
					Config.initGenericConfigEnd = true;
					if(successFN){successFN();}
				}else{
					TDT.alert("获取通用配置错误");
				}
			});
			return true;
	},
	initPlaceNameConfig:function(successFN){
		  var url = Config.url.getWfsConfigUrl;
		  var params = "wfsconfig.serviceType=1";
		  TDT.getDS(url,params,false,
					  function(json){
					  	if(json.result){
					  		Config.poiQueryUrl = json.wfsconfig.serviceURL;
					  		Config.poiQueryLayer = json.wfsconfig.layer;
					  		Config.poiQueryField = json.wfsconfig.queryField;
					  		Config.poiQueryOrderField = json.wfsconfig.orderField;
					  		Config.poiQueryOrderStyle = json.wfsconfig.orderStyle;
					  		Config.poiQueryTotalRecord = json.wfsconfig.queryTotalRecord;
					  		Config.poiQueryPageSize = json.wfsconfig.pageSize;
					  		Config.poiQueryShowTitle = json.wfsconfig.showTitle;
					  		//[+]		showField	"{\"OID\":\"OID\",\"GEOMETRY\":\"GEOMETRY\",\"DOMAINNAME\":\"域名\"}"	String
					  		if(json.wfsconfig.showField.indexOf("{") == 0){
					  		    Config.poiQueryShowField = $.evalJSON(json.wfsconfig.showField);
					  		}else{
					  			Config.poiQueryShowField = json.wfsconfig.showField;
					  		}
					  		//[+]		popupShowfield	"{\"OID\":\"OID\",\"GEOMETRY\":\"GEOMETRY\",\"DOMAINNAME\":\"域名\",\"ADDNAME\":\"名称\"}"	String
					  		if(json.wfsconfig.popupShowfield.indexOf("{") == 0){
					  		    Config.poiQueryPopup = $.evalJSON(json.wfsconfig.popupShowfield);
					  		}else{
					  			Config.poiQueryPopup = json.wfsconfig.popupShowfield;
					  		}
					  		Config.initPlaceNameConfigEnd = true;
					  	}else{
					  		TDT.alert("地名查询配置错误");
					  	}
					  	
					  });
	},
	initCarConfig:function(){
		  var url = Config.url.getWfsConfigUrl;
		  var params = "wfsconfig.serviceType=2";
		  TDT.getDS(url,params,false,
					  function(json){
					  	if(json.result){
					  		Config.carQueryUrl = json.wfsconfig.serviceURL;
					  		Config.carQueryLayer = json.wfsconfig.layer;
					  		Config.carQueryField = json.wfsconfig.queryField;
					  		Config.carQueryOrderField = json.wfsconfig.orderField;
					  		Config.carQueryOrderStyle = json.wfsconfig.orderStyle;
					  		Config.carQueryTotalRecord = json.wfsconfig.queryTotalRecord;
					  		Config.carQueryPageSize = json.wfsconfig.pageSize;
					  		Config.carQueryShowTitle = json.wfsconfig.showTitle;
					  		//[+]		showField	"{\"OID\":\"OID\",\"GEOMETRY\":\"GEOMETRY\",\"DOMAINNAME\":\"域名\"}"	String
					  		if(json.wfsconfig.showField.indexOf("{") == 0){
					  		    Config.carQueryShowField = $.evalJSON(json.wfsconfig.showField);
					  		}else{
					  			Config.carQueryShowField = json.wfsconfig.showField;
					  		}
					  		//[+]		popupShowfield	"{\"OID\":\"OID\",\"GEOMETRY\":\"GEOMETRY\",\"DOMAINNAME\":\"域名\",\"ADDNAME\":\"名称\"}"	String
					  		if(json.wfsconfig.popupShowfield.indexOf("{") == 0){
					  		    Config.carQueryPopup = $.evalJSON(json.wfsconfig.popupShowfield);
					  		}else{
					  			Config.carQueryPopup = json.wfsconfig.popupShowfield;
					  		}
					  		Config.initCarConfigEnd = true;
					  	}else{
					  		TDT.alert("公交地名查询配置错误");
					  	}
					  	
					  });		
	},
	initRouteConfig:function(){
		  var url = Config.url.getWfsConfigUrl;
		  var params = "wfsconfig.serviceType=3";
		  TDT.getDS(url,params,false,
					  function(json){
					  	if(json.result){
					  		Config.routeQueryUrl = json.wfsconfig.serviceURL;
					  		Config.routeQueryLayer = json.wfsconfig.layer;
					  		Config.routeQueryField = json.wfsconfig.queryField;
					  		Config.routeQueryOrderField = json.wfsconfig.orderField;
					  		Config.routeQueryOrderStyle = json.wfsconfig.orderStyle;
					  		Config.routeQueryTotalRecord = json.wfsconfig.queryTotalRecord;
					  		Config.routeQueryPageSize = json.wfsconfig.pageSize;
					  		Config.routeQueryShowTitle = json.wfsconfig.showTitle;
					  		//[+]		showField	"{\"OID\":\"OID\",\"GEOMETRY\":\"GEOMETRY\",\"DOMAINNAME\":\"域名\"}"	String
					  		if(json.wfsconfig.showField.indexOf("{") == 0){
					  		    Config.routeQueryShowField = $.evalJSON(json.wfsconfig.showField);
					  		}else{
					  			Config.routeQueryShowField = json.wfsconfig.showField;
					  		}
					  		//[+]		popupShowfield	"{\"OID\":\"OID\",\"GEOMETRY\":\"GEOMETRY\",\"DOMAINNAME\":\"域名\",\"ADDNAME\":\"名称\"}"	String
					  		if(json.wfsconfig.popupShowfield.indexOf("{") == 0){
					  		    Config.routeQueryPopup = $.evalJSON(json.wfsconfig.popupShowfield);
					  		}else{
					  			Config.routeQueryPopup = json.wfsconfig.popupShowfield;
					  		}
					  		Config.initRouteConfigEnd = true;
					  	}else{
					  		TDT.alert("驾车地名查询配置错误");
					  	}
					  	
					  });			
	},
	init:function(successFN){
		Config.initGenericConfig();
		//Config.initPlaceNameConfig();
		//Config.initCarConfig();
		//Config.initRouteConfig();
		var cfginit = function(){
			// &&Config.initCarConfigEnd
			if(Config.initGenericConfigEnd){
				Config.proxyUrl = TDT.getAppPath("")+ "proxyHandler?url="
				delete cfginit;
				delete Config.url;
				delete Config._GenericConfig;
				delete Config.initGenericConfig;
				delete Config.initGenericConfigEnd;
				delete Config.initPlaceNameConfig
				delete Config.initPlaceNameConfigEnd;
				delete Config.initCarConfig;
				delete Config.initCarConfigEnd;
				delete Config.initRouteConfig;
				delete Config.initRouteConfigEnd;
				delete Config.init;
				if(successFN){successFN();}
			}else{
				setTimeout(cfginit,200);
			}
		}
		setTimeout(cfginit,200);
	}
}