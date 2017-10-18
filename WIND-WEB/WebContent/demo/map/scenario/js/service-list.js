var service = new Service();
var ServiceUI = {};
$(document).ready(function(){

	//载入首尾页面
	//TDT.loadHeaderAndFooter("fanganfuwu");
	
	var id = TDT.getParam("id");
	var type = TDT.getParam("type");
	type = type?type:"Vector";
	service.scenarioType = type;
	service.initdata(id);
//	 service.getServiceResult();
	 $("#US_SRV_SC_ID").val(id);
	 
	 
	 $(".btn").click(function(){
	 	location.href = "scenario.html";
	 });
	 
	 $("#searchCswBtn").live({click:function(){
	 	var srvKeyword = $("#srvKeyword").val();
	 	service.queryServiceFromCSW(srvKeyword);
	 }});
	 
	$("#slider-range-max").slider({
		range: "max",
		min: 0,
		max: 10,
		value: 1,
		slide: function( event, ui ) {
			$("#dituTransp" ).val(ui.value);
		}
	});
	$("#dituTransp").val( $("#slider-range-max").slider("value"));

	var map = initMap(type);
	ServiceUI.ServiceView = new ServiceView();
	ServiceUI.ServiceView.setMap(map);
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

}); 
function initMap(type){
	var map =null;
	if(type == "Globe"){
			if(!isIE()){
					TDT.alert("对不起，三维地图暂只适合在IE内核的浏览器下浏览。");
					return ;
			}
		 	if(!checkActivexVersion()){
		 			TDT.alert("您的电脑上未安装三维插件或安装的版本过低,请安装新版本的三维控件");
					return ;
			}
  			map = new Geo.View3D.Map("map");
	}else{
			map = new Geo.View2D.Map("map",{
	                        controls:[new OpenLayers.Control.Navigation(),
	                              new OpenLayers.Control.TouchNavigation(),
	                              new OpenLayers.Control.PanZoomBar(),
	                              new OpenLayers.Control.ArgParser(),
	                              new OpenLayers.Control.Attribution()
	                              ],
	                        maxExtent:new Geo.Bounds(-180,-90,180,90)
	                        });
			map.events.register("preaddlayer",map,function(obj){
				var layer = obj.layer;
				if(layer.resolutions&&(layer.CLASS_NAME=="OpenLayers.Layer.WMTS"||layer.CLASS_NAME=="OpenLayers.Layer.WMS"||layer.CLASS_NAME=="Geo.View2D.Layer.GeoWMTS")){
					
					if(!this.resolutions){
						this.resolutions = layer.resolutions.slice(0); ;
					}else{
						this.resolutions = TDT.combineArray(this.resolutions,layer.resolutions.slice(0));
					}
					if(this.baseLayer){
						this.baseLayer.resolutions = this.resolutions;
					}
					// 针对WMTS
					if(layer.matrixIds){
						var _matrixIds = [];
						for(var i=0;i<layer.matrixIds.length;i++){
								if(!layer.matrixIds[i].islevelhidden){
									_matrixIds.push(layer.matrixIds[i]);
								}
						}
						layer.matrixIds = _matrixIds;
					}
				}
			});
			map.events.register("removelayer",map,function(obj){
					if (!this.unloadDestroy) {
			            return false;
			        }
					if( obj.layer!=this.baseLayer&&(obj.layer.CLASS_NAME=="OpenLayers.Layer.WMTS"||obj.layer.CLASS_NAME=="OpenLayers.Layer.WMS"||obj.layer.CLASS_NAME=="Geo.View2D.Layer.GeoWMTS")){
						this.resolutions = null
						for(var i = 0,len=this.layers.length; i<len;i++){
							if(this.layers[i]!=this.baseLaye&&!this.layers[i].isBaseLayer&&(this.layers[i].CLASS_NAME=="OpenLayers.Layer.WMTS"||this.layers[i].CLASS_NAME=="OpenLayers.Layer.WMS"||this.layers[i].CLASS_NAME=="Geo.View2D.Layer.GeoWMTS")&&this.layers[i].resolutions){
									if(!this.resolutions){
										this.resolutions = this.layers[i].resolutions.slice(0); 
									}else{
										this.resolutions = TDT.combineArray(this.resolutions,this.layers[i].resolutions.slice(0));
									}
							}
						}
						if(this.baseLayer){
								this.baseLayer.resolutions = this.resolutions;
								this.updateBaseLayer();
						}
					}
			});
		}
		return map;
}
function isIE(){
	var BrowserName = OpenLayers.Util.getBrowserName();  
  	if (BrowserName == "msie") {  
          return true;  
      }  
      return false; 
}

		//获取控件版本号
function checkActivexVersion(){
       /*获取版本号代码，用于判断是否安装三维插件。*/
    var version = Geo.View3D.Map.getActivexVersion();  
       //检查三维插件是否安装
       var globeVersion = "5.0.1.5468";
       if (version){
          var curVerArr = version.split(".");
          var globeVerArr = globeVersion.split(".");
          for(var i in curVerArr){
          		var curVer = parseInt(curVerArr[i]);
          		var globeVer = parseInt(globeVerArr[i]);
          		if(curVer > globeVer){
          			return true;
          		}else if(curVer < globeVer){
          			return false;
          		}
          }
          return true;
       }
	return false;
}


function addOrcsw(type){
	if(type == "add"){
		$("#add").val("add")
		$("#csw").val("")
	}else {
		$("#add").val("")
		$("#csw").val("csw")
		service.queryServiceFromCSW();
	}
}

function inputValue(obj){
	$("#usSrvType").val($(obj).next().val());
}
function checkService(){
	service.checkService();
}

