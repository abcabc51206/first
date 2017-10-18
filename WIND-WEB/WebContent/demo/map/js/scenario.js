/***
 * Scenario 方案类
 * private 属性
 * 
 * private 方法
 * 
 * public 属性
 *   scenarioListDefault  方案的列表（默认）
 * puiblic 方法（接口）
 *   function init(){}  方案的初始化，完成解析方案的xml，scenarioListDefault的赋值，并解析矢量方案，给地图map对象的矢量图层组赋值
 *   function getScenarioListByUrl(url){} 解析方案的xml，scenarioListDefault的赋值
 *   function parseUserScenario(type){}   根据类型解析方案，等到相应的layers[]
 *   function checkChildScenario(scenarioList){} 根据服务列表，得到相应的layers[]
 *   function ResolveLayer(url,type,capabilities){} 根据服务地址，类型，getCapabilities信息 得到相应的layer
 */
(function(){
	var Scenario = window.Scenario = function(){

		//var _scenarioList = [];
		return this.init();
	}
	Scenario.prototype = {
		_scenariojson :null,
		_dynatreeJSON : null,
		_CreateScenarioEnd: false,
		init: function(){
			return this;
		},
		getCreateScenarioEnd:function(){
			return this._CreateScenarioEnd;
		},
		CreateScenarioListByXML:function(xmlurl,successFN){
			this._CreateScenarioEnd = false;
			var parser = new Geo.Util.Format.XML2JSON();
			var that = this;
		    OpenLayers.loadURL(xmlurl,null,null,function(result){
				var json = parser.read(result.responseText);
				that._scenariojson =json.UserScenarios;
				that._CreateScenarioEnd = true;
				that._dynatreeJSON  = that.createDynatreeJSON(json.UserScenarios);
				if(successFN){successFN()};
				/*
				for(var i=0;i<json.length;i++){
					var _UserScenario =that.CreateScenario(json[i]);
					_scenarioList.push(_UserScenario);
				}
				* */
		    });			
		},
		CreateScenarioList:function(xmlurl,successFN){
			this._CreateScenarioEnd = false;
			//var parser = new Geo.Util.Format.XML2JSON();
			var that = this;
			/*
		    OpenLayers.loadURL(xmlurl,null,null,function(result){
		    	
				var json = $.toJSON(result.responseText);
				that._scenariojson =json.UserScenarios;
				that._CreateScenarioEnd = true;
				that._dynatreeJSON  = that.createDynatreeJSON(json.UserScenarios);
				if(successFN){successFN()};
			
		    });
		    * */
			TDT.getDS(xmlurl,null,true,function(json){
				that._scenariojson =json.UserScenarios;
				that._CreateScenarioEnd = true;
				that._dynatreeJSON  = that.createDynatreeJSON(json.UserScenarios);
				if(successFN){successFN()};
			});
			
		},
		CreateScenario:function(UserScenario){
			var _UserScenario={}
			for (var sckey in UserScenario){
				if(sckey=="ServiceList"){
					_UserScenario.layerList = this.CreateLayerList(UserScenario[sckey]);
				}else{
					_UserScenario[sckey] = UserScenario[sckey]
				}
			}
			return _UserScenario;
		},
		CreateLayerList:function(ServiceList){
			var _layerList = [];
			for(var i in ServiceList.Service){
				var _layerobj={}
				_layerobj = ServiceList.Service[i];
				_layerobj.layer = this.CreateLayer(_layerobj.ServiceUrl,_layerobj.ServiceType,_layerobj.ServiceName,_layerobj.ServiceOptions);
				_layerList.push(_layerobj);
			}
			return _layerList;
		},
		/*
		 * 根据服务地址，类型，以及 options 获得相应的 图层 （目前只支持单图层）
		 */
		CreateLayer:function(url,type,options){
			var layer;
			if(type=="TILE"){
				var _options={}
				for(var key in options){
					if(key =="maxExtent"){
						var  arrstr = options[key].split(",");
						_options[key] =new Geo.Bounds(parseFloat(arrstr[0]),parseFloat(arrstr[1]),parseFloat(arrstr[2]),parseFloat(arrstr[3]));
					}else{
						_options[key] = options[key];
					}
				}
				/*
				_options.opacity = options.opacity;
				_options.visibility = options.visibility;
				_options.transitionEffect = options.transitionEffect;
				_options.topLevel = options.topLevel;
				_options.bottomLevel = options.bottomLevel;
				var  arrstr = options.maxExtent.split(",");
				_options.maxExtent = new Geo.Bounds(parseFloat(arrstr[0]),parseFloat(arrstr[1]),parseFloat(arrstr[2]),parseFloat(arrstr[3]));;
				*/
				layer=new OpenLayers.Layer.GlobeTile(options.alias,url,_options);
				//layer.name = options.alias;
			}
			if(type=="MODEL"){
				var _options={};
				var layerName = "";
				for(var key in options){
					if(key =="maxExtent"){
						var  arrstr = options[key].split(",");
						_options[key] =new Geo.Bounds(parseFloat(arrstr[0]),parseFloat(arrstr[1]),parseFloat(arrstr[2]),parseFloat(arrstr[3]));
					}else if(key =="layerName"){
						layerName = options[key];
					}else{
						_options[key] = options[key];
					}
				}
				layer = new Geo.View3D.Layer.Model(layerName, url,_options);
			}
			if(type=="WMS"){
				var _options={};
				for(var key in options){
					if(key=="maxExtent"){
						var  arrstr = options[key].split(",");
						_options[key] =new Geo.Bounds(parseFloat(arrstr[0]),parseFloat(arrstr[1]),parseFloat(arrstr[2]),parseFloat(arrstr[3]));
					}else{
						_options[key] = options[key];
					}
				}
				
				layer = new OpenLayers.Layer.WMS(_options.name,url,{"layers":_options.name,"format": _options.format},_options);
			}
			if(type=="WMTS"){
				if($.trim(options.format)==""){options.format="image/png";}
				var _options={}
				for(var key in options){
					if(key =="tileFullExtent"){
						var  arrstr = options[key].split(",");
						_options[key] =new Geo.Bounds(parseFloat(arrstr[0]),parseFloat(arrstr[1]),parseFloat(arrstr[2]),parseFloat(arrstr[3]));
					}else if(key =="scales"){
						var  _scalesArr = options[key].split(",");
						_options[key] =_scalesArr;
					}else if(key == "topLevel" || key == "bottomLevel" ||key == "opacity"||key == "zoomOffset"){
						_options[key] = parseInt (options[key]);
					}else {
						_options[key] = options[key];
					}
				}
				var _pyramid = new Geo.Pyramid();
				var resolutions=[];
				_options.matrixIds = [];
				for(var i=0;i<options.matrixIds.length;i++){
					if(!options.matrixIds[i].islevelhidden){
						_options.matrixIds.push(options.matrixIds[i]);
						resolutions.push(_pyramid.getResolutionForScale(options.matrixIds[i].scaleDenominator));
					}
				}
				_options.layer = options.name;			
				_options.name = options.alias;
				_options.url = url;
				_options.resolutions = resolutions;
    			layer = new OpenLayers.Layer.WMTS(_options);
			}
			if(type=="VWMTS"){
				if($.trim(options.format)==""){options.format="image/png";}
				var _options={}
				for(var key in options){
					if(key =="tileFullExtent"){
						var  arrstr = options[key].split(",");
						_options[key] =new Geo.Bounds(parseFloat(arrstr[0]),parseFloat(arrstr[1]),parseFloat(arrstr[2]),parseFloat(arrstr[3]));
					}else if(key =="scales"){
						var  _scalesArr = options[key].split(",");
						_options[key] =_scalesArr;
					}else if(key == "topLevel" || key == "bottomLevel" ||key == "opacity"||key == "zoomOffset"){
						_options[key] = parseInt (options[key]);
					}else {
						_options[key] = options[key];
					}
				}
				var _pyramid = new Geo.Pyramid();
				var resolutions=[];
				_options.matrixIds = [];
				for(var i=0;i<options.matrixIds.length;i++){
					if(!options.matrixIds[i].islevelhidden){
						_options.matrixIds.push(options.matrixIds[i]);
						resolutions.push(_pyramid.getResolutionForScale(options.matrixIds[i].scaleDenominator));
					}
				}
				_options.layer = options.name;			
				_options.name = options.alias;
				_options.url = url;
				_options.resolutions = resolutions;
				_options.params = {
								userecent:true
							};
    			layer = new Geo.View2D.Layer.GeoWMTS(_options);	
    			layer.params.time = options.dimension;
				layer.time = options.dimension;
			}
			return layer;
		},
		/*
		 * 根据服务地址，类型，以及 options 获得相应的 图层 （目前只支持单图层） （三维）
		 */
		CreateLayer3D:function(url,type,options){
			var layer;
			var _pyramid = new Geo.Pyramid();
			if(type=="TILE"){
			   var _options={}
				for(var key in options){
					if(key =="maxExtent"){
						var  arrstr = options[key].split(",");
						_options[key] =new Geo.Bounds(parseFloat(arrstr[0]),parseFloat(arrstr[1]),parseFloat(arrstr[2]),parseFloat(arrstr[3]));
					}else{
						_options[key] = options[key];
					}
				}
				layer=new Geo.View3D.Layer.GlobeTile(options.alias, url,_options);   
			}
			if(type=="WMTS"){
					if($.trim(options.format)==""){options.format="image/png";}
					if($.trim(options.tileFullExtent)=="0,0,0,0"){options.tileFullExtent="106.875,19.6875,118.125,28.125";}
					
					var scales = [];
					var resolutions=[];
					var _matrixIds = [];
					for(var i=0;i<options.matrixIds.length;i++){
							if(!options.matrixIds[i].islevelhidden){
								_matrixIds.push(options.matrixIds[i]);
								resolutions.push(_pyramid.getResolutionForScale(options.matrixIds[i].scaleDenominator));
							}
					}
					try{
							var wmtsLyaer = new Geo.View3D.Layer.WMTS({
								name : options.alias,
								url : url,
								matrixSet : options.matrixSet,
								style : options.style,
								layer : options.name,
								//scales : scales,
								matrixIds : _matrixIds,
								maxResolution: _pyramid.getResolutionForScale(_matrixIds[0].scaleDenominator),
								minResolution: _pyramid.getResolutionForScale(_matrixIds[_matrixIds.length-1].scaleDenominator),
								opacity : options.opacity,
								format :options.format,
								transitionEffect : "resize",
								isBaseLayer : false,
								resolutions : resolutions,
								tileFullExtent:Geo.Bounds.fromString(options.tileFullExtent)
							});
					}catch(e){}
	    			layer = wmtsLyaer;   
			}
			if(type=="TERRAIN"){
			    var name = ""
			    if(options&&options.alias){
			       name = options.alias;
			    }else{
			       name = "三维地形";
			    }
			    layer=new Geo.View3D.Layer.Terrain(name, url);  
			}else if(type=="MODEL"){
				var _options={};
				var layerName = "";
				for(var key in options){
					if(key =="maxExtent"){
						var  arrstr = options[key].split(",");
						_options[key] =new Geo.Bounds(parseFloat(arrstr[0]),parseFloat(arrstr[1]),parseFloat(arrstr[2]),parseFloat(arrstr[3]));
					}else if(key =="layerName"){
						layerName = options[key];
					}else{
						_options[key] = options[key];
					}
				}
				layer = new Geo.View3D.Layer.Model(layerName, url,_options);
			}
			return layer;
		},
		//get
		createDynatreeJSON:function(json){
			var _objArry = [];
			for(var i=0;i<json.UserScenario.length;i++){
				var _obj = {};
				_obj.title=json.UserScenario[i].ScenarioName;
				_obj.type=json.UserScenario[i].ScenarioType;
				_obj.key =json.UserScenario[i].ScenarioType; 
				_obj.isFolder = true;
				_obj.children = [];
				for(var j=0;j<json.UserScenario[i].ServiceList.Service.length;j++){
					var _objchild = {};
					_objchild.title=json.UserScenario[i].ServiceList.Service[j].ServiceName;
					//_objchild.type=json.UserScenario[i].ServiceList.Service[j].ServiceType;
					_objchild.isFolder = false;
					_obj.children.push(_objchild);
				}
				if(json.UserScenario[i].ChildUserScenarioList&&json.UserScenario[i].ChildUserScenarioList.UserScenario&&json.UserScenario[i].ChildUserScenarioList.UserScenario.length>0){
					var _temparr = this.createDynatreeJSON(json.UserScenario[i].ChildUserScenarioList);
					_obj.children.concat(_temparr);
				}
				_objArry.push(_obj);
			}
			return _objArry;
		},
		selectDynatreeJSONByType:function(type){
			this.selectDynatreeJSONB(type,this._dynatreeJSON);
		},
		selectDynatreeJSONB:function(type,jsonarr){
			for(var i =0;i<jsonarr.length;i++){
				if(jsonarr[i].type == type){
					jsonarr[i].select=true;
					break;
				}
				if(jsonarr[i].children&&jsonarr[i].children.length>0){
				   this.selectDynatreeJSONB(type,jsonarr[i].children);
				}
			}
			return jsonarr;
		},
		getDynatreeJSON:function(){
			if(this._dynatreeJSON){
				return this._dynatreeJSON;
			}
		},
		/*
		 *  根据方案类别 获取默认方案列表
		 */
		getScenarioByType:function(type,json){
			
			var _tempScenario = null;
			json = json?json:this._scenariojson;
			if(!json){return;}
			for(var i = 0;i<json.UserScenario.length;i++){
				if(json.UserScenario[i].ScenarioType == type && json.UserScenario[i].IsDefault){
					_tempScenario = json.UserScenario[i];
					return _tempScenario;
				}
				if(json.UserScenario[i].ChildUserScenarioList&&json.UserScenario[i].ChildUserScenarioList.UserScenario&&json.UserScenario[i].ChildUserScenarioList.UserScenario.length>0){
					var _tem = this.getScenarioByType(type,json.UserScenario[i].ChildUserScenarioList);
					if(_tem){
						return _tem;
					}
				}
			}
			//return _tempScenario;
		},
		getScenarioByTypeAndNote:function(type,note){
			if(type==""){
				
			}
		},
		/*
		 * 根据方案列表 获取图层列表
		 */
		getLayersByScenario:function(Scenario){
			var _layerArr =new Array();
			for(var i in Scenario.ServiceList.Service){
				 var _layer=null;
				 var _sevice=Scenario.ServiceList.Service[i];
				 var _layerList = _sevice.LayerList;
				 if(_layerList.Layer&&_layerList.Layer.length){
				 	 _layer = this.CreateLayer(_sevice.ServiceUrl,_sevice.ServiceType,_layerList.Layer[0]);
				 } else{
				 	 _layer = this.CreateLayer(_sevice.ServiceUrl,_sevice.ServiceType,_layerList.Layer);
				 }
				_layerArr.push(_layer);
			}
			if(Scenario.ChildUserScenarioList&&Scenario.ChildUserScenarioList.UserScenario&&Scenario.ChildUserScenarioList.UserScenario.length>0){
				for(var j=0;j<Scenario.ChildUserScenarioList.UserScenario.length;j++){
					var _chidlayerarr = this.getLayersByScenario(Scenario.ChildUserScenarioList.UserScenario[i]);
					_layerArr.concat(_chidlayerarr);
				}
		    }
		    return _layerArr;
		},
		getLayerArrByType:function(type){
			var _Scenario = this.getScenarioByType(type);
			var _layerArr = this.getLayersByScenario(_Scenario);
			return _layerArr;
		},
		/*
		 * 根据方案类别  获取默认方案的图层数组（由于默认方案必须只有一个）
		 */
		getGeoLayerGroupByType:function(type){
			var _Scenario = this.getScenarioByType(type);
			var _layerArr = this.getLayersByScenario(_Scenario);
			_layerArr.reverse();
			//if(){ 判断是否是2D还是3D
			var _layerGroup =new Geo.View2D.BaseLayerGroup({layers:[]});
			_layerGroup.layers  = _layerArr;
			//}
			return _layerGroup;			
		}
	}

})();
Scenario.getLayerByUrl = function(url,type){
	
}
Scenario.getLayerByCapabilities = function(reusult){
}