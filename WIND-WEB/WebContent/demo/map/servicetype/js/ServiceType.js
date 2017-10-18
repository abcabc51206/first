/**
 * 服务类型配置模块对象
 * @author wangshoudong
 * @version 1.0 2012/8/9
 */
 
 (function(){
var ServiceType = window.ServiceType = function(){
		return new ServiceType.fn.init();
	};
	
	ServiceType.url = {
		enabledSvrType : "serviceType/getEnabledSvrType.do"
	};
	
	//初始当前页
	ServiceType.pageNum = 1;
	
	//当前页记录条数
	ServiceType.pageSize = 50;
	
	ServiceType.fn = ServiceType.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		/**
		 * 获取可使用的服务类型（下拉框）
		 * @param domId select下拉框的ID 
		 * @param isAsync 是否异步获取
		 */
		getEnabledSvrTypeForSel : function(domId, isAsync){
			var url = ServiceType.url["enabledSvrType"];
			var params = "pageNum="+ServiceType.pageNum+"&pageSize="+ServiceType.pageSize;
			TDT.getDS(url,params,isAsync,function(json){
				if(json.result){
					$.each(json.serviceTypeList,function(i,data){  
		                 $("<option value='"+data.id+"'>"+data.svrTypeName+"</option>").appendTo("#"+domId);  
		            });  
				}
			});
			
		}
	};
	ServiceType.fn.init.prototype = ServiceType.fn;
 })();