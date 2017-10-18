(function($,exports){
	var ServiceView = function(){
		this.init();
		return this;
	}
	ServiceView.prototype = {
		map:null,
		scenarios:null,
		init:function(){
			this.scenarios = new Scenario();
		},
		/*
		 * 根据 Service initdata 得到jsonList 数据 来转成LayerList
		 */
		getLayerListBySerJsonList:function(jsonList){
			var layerList = [];
			for(var i=0;i<jsonList.length;i++){
				if(!jsonList[i].isRoot){
					var _layer = null;
					if(jsonList[i].dataObject&&jsonList[i].dataObject.serviceConfig){
					  if(jsonList[i].dataObject.serviceConfig.Layer&&jsonList[i].dataObject.serviceConfig.Layer.length){
					 	 var layers = jsonList[i].dataObject.serviceConfig.Layer;
					 	 for(var j=0; j<layers.length;j++){
					 	 	_layer = this.scenarios.CreateLayer(jsonList[i].dataObject.serviceURL,jsonList[i].dataObject.serviceType,layers[j]);
						 	if(layers[j].visibility == "true" || layers[j].visibility == true){
						 		if(_layer){
						 			layerList.push(_layer);
						 		}
						 	}
						 }
					  } else{
					 	 _layer = this.scenarios.CreateLayer(jsonList[i].dataObject.serviceURL,jsonList[i].dataObject.serviceType,jsonList[i].dataObject.serviceConfig.Layer);
					 	layerList.push(_layer);
					  }
					}	
				}
			}
			return layerList;
		},
		/*
		 * 根据 Service initdata 得到jsonList 数据 来转成LayerList
		 */
		getLayerList3DBySerJsonList:function(jsonList){
			var layerList = [];
			for(var i=0;i<jsonList.length;i++){
				if(!jsonList[i].isRoot){
					var _layer = null;
					if(jsonList[i].dataObject&&jsonList[i].dataObject.serviceConfig){
					  if(jsonList[i].dataObject.serviceConfig.Layer&&jsonList[i].dataObject.serviceConfig.Layer.length){
					 	 var layers = jsonList[i].dataObject.serviceConfig.Layer;
					 	 for(var j=0; j<layers.length;j++){
					 	 	_layer = this.scenarios.CreateLayer3D(jsonList[i].dataObject.serviceURL,jsonList[i].dataObject.serviceType,layers[j]);
					 		if(_layer){
					 			layerList.push(_layer);
					 		}
						 }
					  } else{
					 	 _layer = this.scenarios.CreateLayer3D(jsonList[i].dataObject.serviceURL,jsonList[i].dataObject.serviceType,jsonList[i].dataObject.serviceConfig.Layer);
					 	layerList.push(_layer);
					  }
					}	
				}
			}
			return layerList;
		},
		loadLayerGroup:function(layergroup){
			  if(!this.map){return;}
	          var sysConf = new Sysconf();
	          var jsonObj='';
			  var allConfValue = sysConf.getAllConf();
			  if(allConfValue.length > 0){
					$.each(allConfValue, function(i, data){
						if(data.argsName == "cityConf"){
							var str=data.argsValue;
							    jsonObj =$.evalJSON(str); 
						}
					});
			   }
			   this.map.loadLayerGroup(layergroup);
			   if(layergroup.layers.length > 0){
			   	 //this.map.zoomToExtent(layergroup.layers[0].maxExtent);
			   }
			   this.map.setCenter(new OpenLayers.LonLat(jsonObj.lon,jsonObj.lat),jsonObj.zoom);
			   //this.map.zoomToExtent(layergroup.layers[0].maxExtent);
			  
		},
		setMap:function(map){
			this.map = map;
		},
		getMap:function(){
			return this.map;
		}
	}
	exports.ServiceView = ServiceView;
})(jQuery,window);
