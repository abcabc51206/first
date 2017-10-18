/**
 * 公交配置模块对象
 * @author wsd
 * @version 1.0 2012/9/1
 */
 
 (function(){
var BusSrvconfig = window.BusSrvconfig = function(){
		return new BusSrvconfig.fn.init();
	};
	
	BusSrvconfig.url = {
		getAll : "sysconf/findAllByPage.do",
		update:"sysconf/updateSysconf.do"
	};
	BusSrvconfig.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	BusSrvconfig.validateTip = {
		
		busUrl : {
			empty : "公交服务地址不能为空，请输入"
		},
		transferTimes : {
			empty : "换乘次数不能为空",
			notNumber:"换乘次数不为正整数"
		},
		queryCount : {
			empty : "查询数据量不能为空",
			notNumber:"查询数据量不为正整数"
		}
	};
	
	//初始当前页
	BusSrvconfig.pageNum = 1;
	
	//当前页记录条数
	BusSrvconfig.pageSize = 10;
	
	BusSrvconfig.fn = BusSrvconfig.prototype = {
	
		/**
		 * 初始化
		 */
		init : function(){
			return this;
		},
		
		
		//提交更新表单
		saveBusconfig : function(){
			var url = BusSrvconfig.url["update"];
			var isValidate = this.validateSysconfForm();
			if(isValidate){
				TDT.formSubmit("busConfUpdateForm",url, null, true, function(json){
					if(json.result){
		    			TDT.alert("恭喜您，更新成功！");
					}
				});
			}
		},
		
		
		/**
		 * 获取所有配置
		 */
		getBusSrvConf : function(){
			var url = BusSrvconfig.url["getAll"];
			var params = "pageNum=1&pageSize=100000";
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					BusSrvconfig.fn.bindBusSrvConf(json.sysconfList);
				}
			});
		},
		
		/**
		 * 重置公交配置
		 */
		resetBusconfig : function(){
			this.getBusSrvConf();
		},
		
		//获取公交服务图层
 		getLayer : function(serviceUrl){
 			var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"?1=1";
 			var parser = new Geo.Util.Format.BusCapabilities();
	        OpenLayers.Request.GET({
	            url: url,
	            params: {
	                REQUEST: "GetCapabilities"
	            
	            },
	            async:false,
	            success: function(request){
	            	var xml = parser.read(request.responseText)
	                try {
	                    var layerName = xml.capability.networks[0];
	                    $("#bus-layer").val(layerName);
	                } 
	                catch (e) {
	                    BusSrvconfig.fn.failFn;
	                }
	            },
	            failure: this.failFn
	        });
		}, 
		
		failFn : function(){
			TDT.alert("获取服务信息失败!");
		},
		
		validateSysconfForm:function(){
			var busSrvConfJson = {};

			var $busUrl = $("#bus-url");
			
			if($busUrl.val() == ""){
				$busUrl.parents("td").find(".required").html("<img src='"+BusSrvconfig.validateErrorImgSrc+"'/>"+BusSrvconfig.validateTip.busUrl.empty);
				$busUrl.focus(function(){
					$(this).parents("td").find(".required").html("");				
				});
				return false;
			}
			
			var $transferTimes = $("#transfer-times");
			var reg = /^[1-9]\d*$/i;
 			if($transferTimes.val() ==""){
				$transferTimes.parents("td").find(".required").html("<img src='"+BusSrvconfig.validateErrorImgSrc+"'/>"+BusSrvconfig.validateTip.transferTimes.empty);
				$transferTimes.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
			var r = $transferTimes.val().match(reg);
 			if(!r){
				$transferTimes.parents("td").find(".required").html("<img src='"+BusSrvconfig.validateErrorImgSrc+"'/>"+BusSrvconfig.validateTip.transferTimes.notNumber);
				$transferTimes.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
			
			var $queryCount = $("#query-count");
			if($queryCount.val() ==""){
				$queryCount.parents("td").find(".required").html("<img src='"+BusSrvconfig.validateErrorImgSrc+"'/>"+BusSrvconfig.validateTip.queryCount.empty);
				$queryCount.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
			var r = $queryCount.val().match(reg);
 			if(!r){
				$queryCount.parents("td").find(".required").html("<img src='"+BusSrvconfig.validateErrorImgSrc+"'/>"+BusSrvconfig.validateTip.queryCount.notNumber);
				$queryCount.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
			
			busSrvConfJson["url"] = $busUrl.val();
			busSrvConfJson["layer"] = $("#bus-layer").val();
			busSrvConfJson["transferTimes"] = $transferTimes.val();
			busSrvConfJson["queryCount"] = $queryCount.val();
			$("#sysconf-argsValue").val($.toJSON(busSrvConfJson));
			return true;
		},
		
		bindBusSrvConf : function(allConfValue){
			$.each(allConfValue, function(i, data){
				if(data.argsName == "busSrvConf"){
					var busSrvConfJson = $.evalJSON(data.argsValue);
					$("#sysconf-id").val(data.id);
					$("#sysconf-argsName").val(data.argsName);
					$("#bus-url").val(busSrvConfJson.url);
					$("#bus-layer").val(busSrvConfJson.layer);
					$("#transfer-times").val(busSrvConfJson.transferTimes);
					$("#query-count").val(busSrvConfJson.queryCount);
					$("#sysconf-argsDesc").val(data.argsDesc);
					return false;
				}
			});
		}
		
	};
	BusSrvconfig.fn.init.prototype = BusSrvconfig.fn;
 })();