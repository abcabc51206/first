/**
 * 标绘配置模块对象
 * @author wsd
 * @version 1.0 2013/5/7
 */
 
 (function(){
var PlotSrvconfig = window.PlotSrvconfig = function(){
		return new PlotSrvconfig.fn.init();
	};
	
	PlotSrvconfig.url = {
		getAll : "sysconf/findAllByPage.do",
		update:"sysconf/updateSysconf.do"
	};
	PlotSrvconfig.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	PlotSrvconfig.validateTip = {
		
		argsValue : {
			empty : "标绘服务地址不能为空，请输入"
		}
	};
	
	//初始当前页
	PlotSrvconfig.pageNum = 1;
	
	//当前页记录条数
	PlotSrvconfig.pageSize = 10;
	
	PlotSrvconfig.fn = PlotSrvconfig.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		
		//提交更新表单
		savePlotConfig : function(){
			var url = PlotSrvconfig.url["update"];
			var isValidate = this.validateSysconfForm();
			if(isValidate){
				TDT.formSubmit("plotConfUpdateForm",url, null, true, function(json){
					if(json.result){
		    			TDT.alert("恭喜您，更新成功！");
					}
				});
			}
		},
		
		/**
		 * 重置标绘配置
		 */
		resetPlotSrvConf : function(){
			this.getPlotSrvConf();
		},
		
		
		/**
		 * 获取标绘配置
		 */
		getPlotSrvConf : function(){
			var url = PlotSrvconfig.url["getAll"];
			var params = "pageNum=1&pageSize=100000";
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					PlotSrvconfig.fn.bindPlotSrvConf(json.sysconfList);
				}
			});
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
	                    $("<option value='0'>请选择查询图层</option>").appendTo("#plot-point-layer");
	                    $("<option value='0'>请选择查询图层</option>").appendTo("#plot-line-layer");
	                    $("<option value='0'>请选择查询图层</option>").appendTo("#plot-polygon-layer");
	                    for (var i = 0; i < array.length; i++) {
	                        arrayFeatureType.push([array[i].name, array[i].name]);
	                        $("<option value='"+array[i].name+"'>"+array[i].name+"</option>").appendTo("#plot-point-layer");
	                        $("<option value='"+array[i].name+"'>"+array[i].name+"</option>").appendTo("#plot-line-layer")
	                        $("<option value='"+array[i].name+"'>"+array[i].name+"</option>").appendTo("#plot-polygon-layer")
	                    }
	                } 
	                catch (e) {
	                    PlotSrvconfig.fn.failFn;
	                }
	            },
	            failure: this.failFn
	        });
		}, 
		
		failFn:function(){
			TDT.alert("获取服务信息失败!");
		},
		
		
		validateSysconfForm:function(){
			var argsValue = $("#plot-url");
			
			var plotSrvConfJson = {};
			if(argsValue.val() == ""){
				argsValue.parents("td").find(".required").html("<img src='"+PlotSrvconfig.validateErrorImgSrc+"'/>"+PlotSrvconfig.validateTip.argsValue.empty);
				argsValue.focus(function(){
					$(this).parents("td").find(".required").html("");				
				});
				return false;
			}
			plotSrvConfJson["plotSrvUrl"] = argsValue.val();
			plotSrvConfJson["pointLayer"] = $("#plot-point-layer").val();
			plotSrvConfJson["lineLayer"] = $("#plot-line-layer").val();
			plotSrvConfJson["polygonLayer"] = $("#plot-polygon-layer").val();
			plotSrvConfJson["maxFeature"] = $("#max-feature").val();
			$("#sysconf-argsValue").val($.toJSON(plotSrvConfJson));
			return true;
		},
		
		bindPlotSrvConf : function(allConfValue){
			$.each(allConfValue, function(i, data){
				if(data.argsName == "markConf"){
					var plotSrvConfJson = $.evalJSON(data.argsValue);
					$("#sysconf-id").val(data.id);
					$("#sysconf-argsName").val(data.argsName);
					$("#plot-url").val(plotSrvConfJson.plotSrvUrl);
					PlotSrvconfig.fn.getLayer(plotSrvConfJson.plotSrvUrl);
					$("#plot-point-layer").val(plotSrvConfJson.pointLayer);
					$("#plot-line-layer").val(plotSrvConfJson.lineLayer);
					$("#plot-polygon-layer").val(plotSrvConfJson.polygonLayer);
					$("#max-feature").val(plotSrvConfJson.maxFeature);
					$("#sysconf-argsDesc").val(data.argsDesc);
					return false;
				}
			});
		}
		
	};
	PlotSrvconfig.fn.init.prototype = PlotSrvconfig.fn;
 })();