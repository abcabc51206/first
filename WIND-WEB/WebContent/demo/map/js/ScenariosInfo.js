/*
 * 方案类
 */
(function($,exports){
	var ScenariosInfo = {};
	ScenariosInfo.Model = function(){
		this.init();
		return this;
	}
	ScenariosInfo.Model.prototype = {
		scenariosList: new Array(),
		currScenarios:null, //当前方案
		init:function(){
			
		},
		url:{
		   getScenariosListByType : "userScenario/findMyScenario.do",
		   getScenarios:"userScenario/findScenarioById.do",
		   viewFile : "userScenario/viewFile.do"
		},
		getScenariosListByType:function(type,successFN){
			var params = "pageNum=1&pageSize=100&userScenario.usScenarioType="+type
			var that = this;
			TDT.getDS(this.url.getScenariosListByType,params,true,function(json){
				that.scenariosList = json.userScenList;
				for(var i=0;i<that.scenariosList.length;i++){
					if(that.scenariosList[i].fileId){
						that.scenariosList[i].imageUrl = that.buildImageUrl(that.scenariosList[i].fileId);
					}else{
						
					}
				}
				if(successFN){
					successFN();
				}
			});
		},
		buildImageUrl :function(fileId){
			var url = this.url["viewFile"];
			var params = "fileId="+fileId+"&t="+Date.parse(new Date());
			var action = TDT.getAppPath(url)+"?"+params;
			return action;
		},
		getScenarios:function(fileId,successFN){
			var params = "userScenario.id="+fileId;
			var that = this;
			TDT.getDS(this.url.getScenarios,params,true,function(json){
				that.currScenarios = json.UserScenarios.UserScenario[0];
				if(successFN){
					successFN();
				}
			});			
		}
	}
	
	ScenariosInfo.View = function(){
		var model;
		this.setModel = function(_model){
			model = _model;
		}
		this.getModel = function(){
			return model;
		}
		return this;		
	}
	ScenariosInfo.View.prototype = {
		isInit:false,
		/*
		 * 方案初始化
		 */
		init:function(){
			this.isInit = true;
			//that = this;
			 /*
			 *  初始化  初始类型下的所有方案
			 */
			 this.getModel().getScenariosListByType("Vector",
			   $.proxy(function(){
			   	  this.scenariosTableView(this.getModel().scenariosList);
			   	  this.scenariosListView(this.getModel().scenariosList);
			   },this)
			 );
			 
			 /*
			  * 单个方案 的点击事件
			  */
			 $(".scenario-content-list li").live({
			   		click:function(){
			   			$(".scenario-container").removeClass("selected");
			   			$(".layer-container").addClass("selected");
			   			DC.scenariosInfoV.showScenarios($(this).attr("fileId"));
			   		}
			 });
			//我的方案眼睛的切换
			$(".layer-list li label span").live({click:function(){
				//$(this).toggleClass("eye-close");
				$(this).parents("li").siblings("li").removeClass("select");
				$(this).parents("li").addClass("select");
			}})
			$(".layer-list li").live({
				mouseenter:function(){
					$(this).addClass("hover");
				}
				,mouseleave:function(){
					$(this).removeClass("hover");
				}
			});
			//置顶
			$(".layer-top").live({
				click:function(){
					//$(".layer-list li").
					var lilength = $(".layer-list li").length;
					var index = $(".layer-list li").index($(".layer-list li.select")); 
					var layerid = $(".layer-list li.select").attr("layerid");
					var layer = DC.Map.map2d.map.getLayer(layerid);
					DC.Map.map2d.map.raiseLayer(layer,index);
					DC.scenariosInfoV.layerListMove(index,0);
				}
			});
			//上移 
			$(".layer-up").live({
				click:function(){
					//$(".layer-list li").
					var lilength = $(".layer-list li").length;
					var index = $(".layer-list li").index($(".layer-list li.select")); 
					if(index>0){
						var layerid = $(".layer-list li.select").attr("layerid");
						var layer = DC.Map.map2d.map.getLayer(layerid);
						DC.Map.map2d.map.raiseLayer(layer,1);
						DC.scenariosInfoV.layerListMove(index,index-1);
					}
				}
			});
			//下移
			$(".layer-down").live({
				click:function(){
					//$(".layer-list li").
					var lilength = $(".layer-list li").length;
					var index = $(".layer-list li").index($(".layer-list li.select")); 
					var layerid = $(".layer-list li.select").attr("layerid");
					if(index < lilength-1){
						var layer = DC.Map.map2d.map.getLayer(layerid);
						DC.Map.map2d.map.raiseLayer(layer,-1);
						DC.scenariosInfoV.layerListMove(index,index+1);
					}
				}
			});
			//置底 
			$(".layer-bottom").live({
				click:function(){
					//$(".layer-list li").
					var lilength = $(".layer-list li").length;
					var index = $(".layer-list li").index($(".layer-list li.select")); 
					var layerid = $(".layer-list li.select").attr("layerid");
					if(index < lilength-1){
						var layer = DC.Map.map2d.map.getLayer(layerid);
						DC.Map.map2d.map.raiseLayer(layer,index-lilength);
						DC.scenariosInfoV.layerListMove(index,lilength-1);
					}
				}
			});
			/*
			 *  眼睛 开启关闭
			 */
			$(".layer-list .eye").live({
				click:function(){
					$(this).toggleClass("open");
					if($(this).hasClass("open")){
						var layerid = $(this).parent().parent().attr("layerid");
						var layer = DC.Map.map2d.map.getLayer(layerid);
						layer.setVisibility(true);
					}else{
						var layerid = $(this).parent().parent().attr("layerid");
						var layer = DC.Map.map2d.map.getLayer(layerid);
						layer.setVisibility(false);
					}
				}
			});
						
		},
		getScenariosListByType:function(type){
			 this.getModel().getScenariosListByType(type,
			   $.proxy(function(){
			   	  this.scenariosTableView(this.getModel().scenariosList);
			   	  this.scenariosListView(this.getModel().scenariosList);
			   },this)
			 );			
		},
		layerListMove:function(selIndex,toIndex){
			var selIndexDoc = $(".layer-list li").eq(selIndex).clone();
			var toIndexDoc = $(".layer-list li").eq(toIndex).clone();
			//$(".layer-list li").eq(selIndex).replaceAll($(".layer-list li").eq(toIndex));
			toIndexDoc.replaceAll($(".layer-list li").eq(selIndex));
			selIndexDoc.replaceAll($(".layer-list li").eq(toIndex));
			//$(".layer-list li").eq();
		},
		scenariosTableView:function(userScenarios){
			$(".table-view").empty();
			$("#TableViewTmpl").tmpl(userScenarios).appendTo(".table-view");
		},
		scenariosListView:function(userScenarios){
			$(".list-view").empty();
			$("#ListViewTmpl").tmpl(userScenarios).appendTo(".list-view");			
		},
		showScenarios:function(fileId){
			this.getModel().getScenarios(fileId,
			       $.proxy(function(){
			       	    //this.getModel().currScenarios = DC.scenario.getScenarioByType("Vector");
			       	    var _layerArr = DC.scenario.getLayersByScenario(this.getModel().currScenarios);
			       	    this.layerListView(_layerArr);
                        var _layerGroup =new Geo.View2D.BaseLayerGroup({layers:[]});
                        _layerArr.reverse();
			            _layerGroup.layers  = _layerArr;
			            var nullLayer = new Geo.View2D.Layer("global", { //" global "是图层名称
						       minResolution: DC.Map.map2d.map.pyramid.getResolutionForLevel(20),  
						       maxResolution:DC.Map.map2d.map.pyramid.getResolutionForLevel(0),
						       	 maxExtent: new Geo.Bounds(-180, -90, 180, 90)
						});
						_layerGroup.layers.push(nullLayer);
					    DC.Map.addLayerGroup(_layerGroup,"2D");
					    
					   //jQuery slider用来控制图层透明度
					   $(".layer-slider").slider({
					   		value:2,
					   		min:0,
					   		max:10,
					   		slide:function(event, ui ){
					   			//ui.value
					   			var layerid = $(this).parent().attr("layerid");
					   			var layer = DC.Map.map2d.map.getLayer(layerid);
					   			layer.setOpacity(ui.value/10);
					   		}
					   });
					   for(var i=0;i<$(".layer-slider").length;i++){
					   	   $(".layer-slider").eq(i).slider( "option", "value", (_layerArr[i].opacity)*10);
					   }
			       },this)
			   );
		},
		layerListView:function(layerData){
			$(".layer-list").empty();
			$("#LayerListTmpl").tmpl(layerData).appendTo(".layer-list");
		}
	}
	exports.ScenariosInfo = ScenariosInfo;
})(jQuery,window);