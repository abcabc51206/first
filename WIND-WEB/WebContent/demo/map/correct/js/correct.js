var Correct = {
	init:function(){
		Config;
		Correct.map = new Geo.View2D.Map("mapbox",{controls:[new OpenLayers.Control.Navigation(),
                                                             new OpenLayers.Control.TouchNavigation(),
                                                             new OpenLayers.Control.PanZoomBar(),
                                                             new OpenLayers.Control.ArgParser(),
                                                             new OpenLayers.Control.Attribution()
                                                             ],
                                                maxExtent: new OpenLayers.Bounds(-180, -90, 180, 90)});
		Correct.scenario = new Scenario();
		Correct.map.events.register("preaddlayer",Correct.map,function(obj){
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
			Correct.map.events.register("removelayer",Correct.map,function(obj){
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
		var successFN = function(){
				  var layergroup = Correct.scenario.getGeoLayerGroupByType("Vector");
			       Correct.map.loadLayerGroup(layergroup);
			       // 初始化 地图 中心点
				   var initlon = parseFloat(Config.cityConf.lon);
				   var initlat = parseFloat(Config.cityConf.lat);
				   var initzoom = parseInt(Config.cityConf.zoom);
			       Correct.map.setCenter(new OpenLayers.LonLat(initlon,initlat),initzoom);
	   			   var url = Config.proxyUrl+Config.wrongSrvConf.wrongurl;
	   			   var markLayers = {
 							pointLayer:Config.wrongSrvConf.pointLayer,
 							lineLayer:Config.wrongSrvConf.lineLayer,
 							polygonLayer:Config.wrongSrvConf.polygonLayer}
 	   			   var markQuery = new MarkQuery({url:url,markLayers:markLayers});
		           Correct.wrongInfoM = new WrongInfo.Model();
		           Correct.wrongInfoM.setPlot(markQuery,markLayers);
		           Correct.wrongInfoV = new WrongInfo.View(Correct.map);
		           Correct.wrongInfoV.setModel(Correct.wrongInfoM);
		           var type = $("#handletype > input:checked").attr("status");
		           if(type=="nohandle"){
		           	   Correct.wrongInfoM.getWrongInfoFeaListByNoHandle(function(features){
		           	   	  Correct.wrongInfoV.wrongFeaList = features;
		           	   	  Correct.wrongInfoV.initPage();
		           	   	  Correct.wrongInfoV.fristPage();
		           	   });
		           }else if(type=="handle"){
		           	   Correct.wrongInfoM.getWrongInfoFeaListByHandle(function(features){
		           	   	  Correct.wrongInfoV.wrongFeaList = features;
		           	   	  Correct.wrongInfoV.initPage();
		           	   	  Correct.wrongInfoV.fristPage();
		           	   });
		           }
		}
		Correct.scenario.CreateScenarioList("userScenario/findDefaultScenario.do",successFN);
		
	},
	initView:function(){
		$(".close").click(function(){
			$("#table").toggle();
		})
		$("#table tr:odd td").css("background","#eeeeee");
		/*
		 * 列表查看
		 */
		$(".view").live('click',function(){
			var wrongid = $(this).attr("wrongid");
			$("#table_div").hide();
			$("#poiname_div").show();
			Correct.showWrongFea(wrongid);
			$("#poiname_div").animate({left:"0px"},500,function(){
				$(this).animate({left:"-4px"},30,function(){
					  $(this).animate({left:"0px"},30,function(){
					  	$(this).animate({left:"-2px"},30,function(){
					  		 $(this).animate({left:"0px"},30);
					  	});
					  });
				});
			});
		});
		/*
		 * 列表删除
		 */
		$(".dele").live('click',function(){var wrongid = $(this).attr("wrongid");Correct.deleteWrongInfoFea(wrongid);});
		/*
		 *  详细中得返回
		 */
		$("#backbtn").live('click',function(){
			$("#poiname_div").animate({left:"-450px"},500);
			$("#poiname_div").hide();
			Correct.wrongInfoV.vectorLayer.removeAllFeatures();
			$("#table_div").show();
		});	
		/*
		 *  详细中得处理
		 */
		$("#submits").live('click',function(){
			var wrongid = $("#pointID").text();
			var verify = $("#verify").val();
			Correct.wrongInfoV.publishWrongInfoFea(wrongid,verify);
		});
		/*
		 *  详细中得删除
		 */
		$("#delbtn").live('click',function(){
			var wrongid = $("#pointID").text();
			Correct.deleteWrongInfoFea(wrongid);
		});					
		/*
		 * 已处理和未处理的切换
		 */
		$("#handletype > input").live('click',function(){
		           var type = $("#handletype > input:checked").attr("status");
		           if(type=="nohandle"){
		           	   Correct.wrongInfoM.getWrongInfoFeaListByNoHandle(function(features){
		           	   	  Correct.wrongInfoV.wrongFeaList = features;
		           	   	  Correct.wrongInfoV.initPage();
		           	   	  Correct.wrongInfoV.fristPage();		           	   	
		           	   });
		           }else if(type=="handle"){
		           	  Correct.wrongInfoM.getWrongInfoFeaListByHandle(function(features){
		           	   	  Correct.wrongInfoV.wrongFeaList = features;
		           	   	  Correct.wrongInfoV.initPage();
		           	   	  Correct.wrongInfoV.fristPage();
		           	   });
		           }			
		});	
		
		//首页
		$(".fristPage").live('click',function(){Correct.wrongInfoV.fristPage();});
		//上一页
		$(".prevPage").live('click',function(){Correct.wrongInfoV.prevPage();});
		//下一页
		$(".nextPage").live('click',function(){Correct.wrongInfoV.nextPage();});
		//尾页
		$(".lastPage").live('click',function(){Correct.wrongInfoV.lastPage();});
	},
	/*
	 * 显示纠错
	 */
	showWrongFea:function(wrongid){
		var wrongFea = null;
		for(var i = 0;i<Correct.wrongInfoV.currentWrongFea.length;i++){
			if(wrongid == Correct.wrongInfoV.currentWrongFea[i].attributes.OID){
				wrongFea = Correct.wrongInfoV.currentWrongFea[i];
				break;
			}
		}
		if(wrongFea){
			$("#poiname").text(wrongFea.attributes.TITLE);
			$("#des").val(wrongFea.attributes.SUPPLYINFO);
			$("#verify").val(wrongFea.attributes.VERFYINFO);
			$("#pointID").text(wrongFea.attributes.OID);
			if(wrongFea.attributes.TYPE == "wrongplace"){
				$(".radiocell  input").eq(0).attr("checked",true);
				$(".radiocell  input").eq(0).click();
				var lonlatArr = wrongFea.attributes.ICONPATH.split(",");
				var newfeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(parseFloat(lonlatArr[0]),parseFloat(lonlatArr[1])));
				Correct.wrongInfoV.showWrongFeaWrongPlace(wrongFea,newfeature);
			}else if(wrongFea.attributes.TYPE == "noexist"){
				$(".radiocell  input").eq(1).attr("checked",true);
				$(".radiocell  input").eq(1).click();
				Correct.wrongInfoV.showWrongFeaNoExist(wrongFea);
			}
			if(wrongFea.attributes.STATUS == "1"){
				$("#des").attr("readOnly",true);
				$("#verify").attr("readOnly",true);
				$("#submits").hide();
			}else if(wrongFea.attributes.STATUS == "0"){
				$("#des").attr("readOnly",true);
				$("#verify").attr("readOnly",false);
				$("#submits").show();
			}
		}else{
			TDT.alert("木有标绘");
		}
	},
	deleteWrongInfoFea:function(wrongid){
		TDT.confirm("确认删除吗？",function(){
		 	Correct.wrongInfoV.deleteWrongInfoFea(wrongid);
		});
	},
	setOption:function(obj){
		$(".radiocell").removeClass("on");
		$(obj).parents(".radiocell").addClass("on");
	},
	
	
	//提交更新表单
	saveCorrectConfig : function(){
		var url = "sysconf/updateSysconf.do";
		var isValidate = this.validateSysconfForm();
		if(isValidate){
			TDT.formSubmit("correctConfUpdateForm",url, null, true, function(json){
				if(json.result){
	    			TDT.alert("恭喜您，更新成功！");
				}
			});
		}
	},
	
	
	/**
	 * 获取所有配置
	 */
	getCorrectSrvConf : function(){
		var url = "sysconf/findAllByPage.do";
		var params = "pageNum=1&pageSize=100000";
		TDT.getDS(url,params,true,function(json){
			if(json.result){
				Correct.bindCorrectSrvConf(json.sysconfList);
			}
		});
	},
	
	resetCorrectConfig : function(){
		Correct.getCorrectSrvConf();
	},
	
	
	validateSysconfForm:function(){
		Correct.validateErrorImgSrc = "../images/error.gif";
		//表单验证提示信息
		Correct.validateTip = {
			argsValue : {
				empty : "纠错服务地址不能为空，请输入"
			}
		};
		var argsValue = $("#correct-url");
		
		var correctSrvConfJson = {};
		if(argsValue.val() == ""){
			argsValue.parents("td").find(".required").html("<img src='"+Correct.validateErrorImgSrc+"'/>"+Correct.validateTip.argsValue.empty);
			argsValue.focus(function(){
				$(this).parents("td").find(".required").html("");				
			});
			return false;
		}
		correctSrvConfJson["wrongurl"] = argsValue.val();
		correctSrvConfJson["pointLayer"] = $("#correct-point-layer").val();
		correctSrvConfJson["lineLayer"] = $("#correct-line-layer").val();
		correctSrvConfJson["polygonLayer"] = $("#correct-polygon-layer").val();
		$("#sysconf-argsValue").val($.toJSON(correctSrvConfJson));
		return true;
	},
	
	//获取服务图层列表
 	getLayer : function(serviceUrl){
 			var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"?1=1";
	        OpenLayers.Request.GET({
	            url: url,
	            params: {
	                REQUEST: "GetCapabilities",
	                SERVICE: "wfs",
	                VERSION: "1.0.0"
	            
	            },
	            async:false,
	            success: function(request){
	                //var doc = request.responseXML;
	                var doc = request.responseText;
	                var jsonOnj = new OpenLayers.Format.WFSCapabilities().read(doc);
	                var arrayFeatureType = [];
	                try {
	                    var array = jsonOnj.featureTypeList.featureTypes;
	                    $("<option value='0'>请选择查询图层</option>").appendTo("#correct-point-layer");
	                    $("<option value='0'>请选择查询图层</option>").appendTo("#correct-line-layer");
	                    $("<option value='0'>请选择查询图层</option>").appendTo("#correct-polygon-layer");
	                    for (var i = 0; i < array.length; i++) {
	                        arrayFeatureType.push([array[i].name, array[i].name]);
	                        $("<option value='"+array[i].name+"'>"+array[i].name+"</option>").appendTo("#correct-point-layer");
	                        $("<option value='"+array[i].name+"'>"+array[i].name+"</option>").appendTo("#correct-line-layer")
	                        $("<option value='"+array[i].name+"'>"+array[i].name+"</option>").appendTo("#correct-polygon-layer")
	                    }
	                } 
	                catch (e) {
	                    Correct.failFn;
	                }
	            },
	            failure: this.failFn
	        });
	}, 
	
	failFn:function(){
		TDT.alert("获取服务信息失败!");
	},
	
	bindCorrectSrvConf : function(allConfValue){
		$.each(allConfValue, function(i, data){
			if(data.argsName == "wrongSrvConf"){
				$("#sysconf-id").val(data.id);
				$("#sysconf-argsName").val(data.argsName);
				var correctSrvConfJson = $.evalJSON(data.argsValue);
				$("#correct-url").val(correctSrvConfJson.wrongurl);
				Correct.getLayer(correctSrvConfJson.wrongurl);
				$("#correct-point-layer").val(correctSrvConfJson.pointLayer);
				$("#correct-line-layer").val(correctSrvConfJson.lineLayer);
				$("#correct-polygon-layer").val(correctSrvConfJson.polygonLayer);
				$("#sysconf-argsDesc").val(data.argsDesc);
				return false;
			}
		});
	}
	
};

