/**
 * 驾车配置模块对象
 * @author wsd
 * @version 1.0 2012/9/1
 */
 
 (function(){
var CarSrvconfig = window.CarSrvconfig = function(){
		return new CarSrvconfig.fn.init();
	};
	
	CarSrvconfig.url = {
		getAll : "sysconf/findAllByPage.do",
		update:"sysconf/updateSysconf.do"
	};
	CarSrvconfig.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	CarSrvconfig.validateTip = {
		
		argsValue : {
			empty : "驾车服务地址不能为空，请输入"
		},
		layerValue : {
			empty : "图层不能为空，请输入"
		}
	};
	
	//初始当前页
	CarSrvconfig.pageNum = 1;
	
	//当前页记录条数
	CarSrvconfig.pageSize = 10;
	
	CarSrvconfig.fn = CarSrvconfig.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		
		//提交更新表单
		saveRouteconfig : function(){
			var url = CarSrvconfig.url["update"];
			var isValidate = this.validateSysconfForm();
			if(isValidate){
				TDT.formSubmit("routeConfUpdateForm",url, null, true, function(json){
					if(json.result){
		    			TDT.alert("恭喜您，更新成功！");
					}
				});
			}
		},
		
		/**
		 * 重置驾车配置
		 */
		resetCarSrvConf : function(){
			this.getCarSrvConf();
		},
		
		
		/**
		 * 获取所有配置
		 */
		getCarSrvConf : function(){
			var url = CarSrvconfig.url["getAll"];
			var params = "pageNum=1&pageSize=100000";
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					CarSrvconfig.fn.bindCarSrvConf(json.sysconfList);
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
	                SERVICE: "ROUTE",
	                VERSION: "1.0.0"
	            
	            },
	            async:false,
	            success: function(result){
	                var responseXML = OpenLayers.Format.XML.prototype.read.apply(this, [result.responseText]);
           			var nodes = responseXML.getElementsByTagName("Data");
           			$("#rs-layer").html("");
           			$("<option value='0'>请选择查询图层</option>").appendTo("#rs-layer");
           			for(var i = 0; i < nodes.length; i++){
           					var layer =	nodes[i].firstChild.nodeValue;
           					$("<option value='"+layer+"'>"+layer+"</option>").appendTo("#rs-layer");
           			}
	            },
	            failure: this.failFn
	        });
		}, 
		
		validateSysconfForm:function(){
			var type = $("#urltype > input:checked").attr("urlType");
			var carSrvConfJson = {};
			carSrvConfJson["urlType"] = type;
			if(type=="tdt"){//天地图服务
				var argsValue = $("#tdt-url");
				if(argsValue.val() == ""){
					argsValue.parents("td.tdt-td").find(".required").html("<img src='"+CarSrvconfig.validateErrorImgSrc+"'/>"+CarSrvconfig.validateTip.argsValue.empty);
					argsValue.focus(function(){
						$(this).parents("td.tdt-td").find(".required").html("*");				
					});
					return false;
				}
				
				carSrvConfJson["url"] = argsValue.val();
			}else if(type=="rs"){//睿数服务
				var argsValue = $("#rs-url");
				if(argsValue.val() == ""){
					argsValue.parents("td .rs-td").find(".required").html("<img src='"+CarSrvconfig.validateErrorImgSrc+"'/>"+CarSrvconfig.validateTip.argsValue.empty);
					argsValue.focus(function(){
						$(this).parents("td .rs-td").find(".required").html("*");				
					});
					return false;
				}
				var layerValue = $("#rs-layer");
				if(layerValue.val() == "" || layerValue.val() == "0"){
					layerValue.parent().find(".required").html("<img src='"+CarSrvconfig.validateErrorImgSrc+"'/>"+CarSrvconfig.validateTip.layerValue.empty);
					layerValue.click(function(){
						$(this).parent().find(".required").html("*");				
					});
					return false;
				}
				carSrvConfJson["url"] = argsValue.val();
				carSrvConfJson["layer"] = layerValue.val();
			}
			$("#sysconf-argsValue").val($.toJSON(carSrvConfJson));
			return true;
		},
		
		bindCarSrvConf : function(allConfValue){
			$.each(allConfValue, function(i, data){
				if(data.argsName == "routeSrvConf"){
					var carSrvConfJson = $.evalJSON(data.argsValue);
					$("#sysconf-id").val(data.id);
					$("#sysconf-argsName").val(data.argsName);
					$("#sysconf-argsDesc").val(data.argsDesc);
					if(carSrvConfJson.urlType == "tdt"){
						$("#urltype > input").eq(0).click();
						$("#tdt-url").val(carSrvConfJson.url);
					}else if(carSrvConfJson.urlType == "rs"){
						$("#urltype > input").eq(1).click();
						$("#rs-url").val(carSrvConfJson.url);
						CarSrvconfig.fn.getLayer(carSrvConfJson.url);
						$("#rs-layer").val(carSrvConfJson.layer);
					}
					return false;
				}
			});
		}
		
	};
	CarSrvconfig.fn.init.prototype = CarSrvconfig.fn;
 })();