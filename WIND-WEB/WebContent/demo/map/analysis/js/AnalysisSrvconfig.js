/**
 * 标绘配置模块对象
 * @author wsd
 * @version 1.0 2013/5/7
 */
 
 (function(){
var AnalysisSrvconfig = window.AnalysisSrvconfig = function(){
		return new AnalysisSrvconfig.fn.init();
	};
	
	AnalysisSrvconfig.url = {
		getAll : "sysconf/findAllByPage.do",
		update:"sysconf/updateSysconf.do"
	};
	AnalysisSrvconfig.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	AnalysisSrvconfig.validateTip = {
		
		argsValue : {
			empty : "标绘服务地址不能为空，请输入"
		}
	};
	
	//初始当前页
	AnalysisSrvconfig.pageNum = 1;
	
	//当前页记录条数
	AnalysisSrvconfig.pageSize = 10;
	
	AnalysisSrvconfig.fn = AnalysisSrvconfig.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		
		//提交更新表单
		saveAnalysisConfig : function(){
			var url = AnalysisSrvconfig.url["update"];
			var isValidate = this.validateSysconfForm();
			if(isValidate){
				TDT.formSubmit("analysisConfUpdateForm",url, null, true, function(json){
					if(json.result){
		    			TDT.alert("恭喜您，更新成功！");
					}
				});
			}
		},
		
		/**
		 * 重置标绘配置
		 */
		resetAnalysisSrvConf : function(){
			this.getAnalysisSrvConf();
		},
		
		
		/**
		 * 获取标绘配置
		 */
		getAnalysisSrvConf : function(){
			var url = AnalysisSrvconfig.url["getAll"];
			var params = "pageNum=1&pageSize=100000";
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					AnalysisSrvconfig.fn.bindAnalysisSrvConf(json.sysconfList);
				}
			});
		},
		
		validateSysconfForm:function(){
			var argsValue = $("#analysis-url");
			
			var analysisSrvConfJson = {};
			if(argsValue.val() == ""){
				argsValue.parents("td").find(".required").html("<img src='"+AnalysisSrvconfig.validateErrorImgSrc+"'/>"+AnalysisSrvconfig.validateTip.argsValue.empty);
				argsValue.focus(function(){
					$(this).parents("td").find(".required").html("");				
				});
				return false;
			}
			analysisSrvConfJson["analysisSrvUrl"] = argsValue.val();
			$("#sysconf-argsValue").val($.toJSON(analysisSrvConfJson));
			return true;
		},
		
		bindAnalysisSrvConf : function(allConfValue){
			$.each(allConfValue, function(i, data){
				if(data.argsName == "bufferAnalysisConfig"){
					var analysisSrvConfJson = $.evalJSON(data.argsValue);
					$("#sysconf-id").val(data.id);
					$("#sysconf-argsName").val(data.argsName);
					$("#analysis-url").val(analysisSrvConfJson.analysisSrvUrl);
					return false;
				}
			});
		}
		
	};
	AnalysisSrvconfig.fn.init.prototype = AnalysisSrvconfig.fn;
 })();