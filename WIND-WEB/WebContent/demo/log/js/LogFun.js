/**
 * 系统功能操作日志模块对象
 * @author wangshoudong
 * @version 1.0 2012/10/18
 */
 
 (function(){
var LogFun = window.LogFun = function(){
		return new LogFun.fn.init();
	};
	
	LogFun.url = {
		searchPass30LogFun : "log/searchPass30LogFun.do",
		searchEveryYearLogFun : "log/searchEveryYearLogFun.do",
		searchEveryMonthLogFun : "log/searchEveryMonthLogFun.do",
		searchEveryDayLogFun : "log/searchEveryDayLogFun.do"
	};
	
	//初始当前页
	LogFun.pageNum = 1;
	
	//当前页记录条数
	LogFun.pageSize = 10;
	
	LogFun.fn = LogFun.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		
		/**
		 * 统计过去30天用户访问量
		 */
		searchPass30LogFun : function(){
			var url = LogFun.url["searchPass30LogFun"];
			var params = "pageNum=1&pageSize=2000000000";
			var data;
			TDT.getDS(url,params,false,function(json){
				if(json.result){
					data = json.result;
				}
			});
			return data;
		},
		
		/**
		 * 统计过去30天用户访问量详细信息
		 */
		searchPass30LogFunForDetail : function(){
			var url = LogFun.url["searchPass30LogFun"];
			var params = "pageNum="+LogFun.pageNum+"&pageSize="+LogFun.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					var data = json.result;
					if(data.logFunList.length>0){
						LogFun.fn.bindLogFunList(data.logFunList,"logFun");
						var pagerObj = document.getElementById("pager");
						TDT.pager(LogFun.pageNum, LogFun.pageSize, data.page.recordCount, pagerObj, function(p){
							LogFun.pageNum = p;
							LogFun.fn.searchPass30LogFunForDetail();
						});
						$("#noData").hide();
					} else{
						$("#logFunList").html("");
						$("#noData").show();		
						$("#pager").html("");
					}
				}else {
					$("#LogFunList").html("发生异常，请联系管理员！");
					$("#pager").html("");
				}
			});
		},
		
		/**
		 * 统计每年用户访问量
		 */
		searchEveryYearLogFun : function(currYear){
			var url = LogFun.url["searchEveryYearLogFun"];
			var params = "pageNum=1&pageSize=2000000000&currDate="+currYear;
			var data;
			TDT.getDS(url,params,false,function(json){
				if(json.result){
					data = json.result;
				}
			});
			return data;
		},
		
		/**
		 * 统计用户访问量每年动态
		 */
		searchEveryYearLogFunForDetail : function(currYear){
			var url = LogFun.url["searchEveryYearLogFun"];
			var params = "pageNum="+LogFun.pageNum+"&pageSize="+LogFun.pageSize+"&currDate="+currYear;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					var data = json.result;
					if(data.logFunList.length>0){
						LogFun.fn.bindLogFunList(data.logFunList,"logFun");
						var pagerObj = document.getElementById("pager");
						TDT.pager(LogFun.pageNum, LogFun.pageSize, data.page.recordCount, pagerObj, function(p){
							LogFun.pageNum = p;
							LogFun.fn.searchEveryYearLogFunForDetail(currYear);
						});
						$("#noData").hide();
					} else{
						$("#logFunList").html("");
						$("#noData").show();		
						$("#pager").html("");
					}
				}
			});
		},
		
		/**
		 * 统计每月用户访问量
		 */
		searchEveryMonthLogFun : function(currYearMonth){
			var url = LogFun.url["searchEveryMonthLogFun"];
			var params = "pageNum=1&pageSize=2000000000&currDate="+currYearMonth;
			var data;
			TDT.getDS(url,params,false,function(json){
				if(json.result){
					data = json.result;
				}
			});
			return data;
		},
		
		/**
		 * 统计用户访问量每月动态
		 */
		searchEveryMonthLogFunForDetail : function(currYearMonth){
			var url = LogFun.url["searchEveryMonthLogFun"];
			var params = "pageNum="+LogFun.pageNum+"&pageSize="+LogFun.pageSize+"&currDate="+currYearMonth;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					var data = json.result;
					if(data.logFunList.length>0){
						LogFun.fn.bindLogFunList(data.logFunList,"logFun");
						var pagerObj = document.getElementById("pager");
						TDT.pager(LogFun.pageNum, LogFun.pageSize, data.page.recordCount, pagerObj, function(p){
							LogFun.pageNum = p;
							LogFun.fn.searchEveryMonthLogFunForDetail(currYearMonth);
						});
						$("#noData").hide();
					} else{
						$("#logFunList").html("");
						$("#noData").show();		
						$("#pager").html("");
					}
				}
			});
		},
		
		/**
		 * 统计每日用户访问量
		 */
		searchEveryDayLogFun : function(currDate){
			var url = LogFun.url["searchEveryDayLogFun"];
			var params = "pageNum=1&pageSize=2000000000&currDate="+currDate;
			var data;
			TDT.getDS(url,params,false,function(json){
				if(json.result){
					data = json.result;
				}
			});
			return data;
		},
		
		/**
		 * 统计用户访问量每日动态
		 */
		searchEveryDayLogFunForDetail : function(currDate){
			var url = LogFun.url["searchEveryDayLogFun"];
			var params = "pageNum="+LogFun.pageNum+"&pageSize="+LogFun.pageSize+"&currDate="+currDate;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					var data = json.result;
					if(data.logFunList.length>0){
						LogFun.fn.bindLogFunList(data.logFunList,"logFun");
						var pagerObj = document.getElementById("pager");
						TDT.pager(LogFun.pageNum, LogFun.pageSize, data.page.recordCount, pagerObj, function(p){
							LogFun.pageNum = p;
							LogFun.fn.searchEveryDayLogFunForDetail(currDate);
						});
						$("#noData").hide();
					} else{
						$("#logFunList").html("");
						$("#noData").show();		
						$("#pager").html("");
					}
				}
			});
		},
		
		/*
		 * 绑定 通用配置数据列表
		 */
		bindLogFunList : function(json, key){
			var list = $("#"+key+"List");
			var html = [];
			list.html("");
			var template = $("#"+key+"Template");
			var temp = template.html();
			$.each(json,function(i,data){
		        var row = temp;
		        row = row.replace(/\%{rowid}%/g, data.id);
				row = row.replace(/\%{userName}%/g, data.userName || "");
				row = row.replace(/\%{userIp}%/g, data.userIp || "");
				row = row.replace(/\%{operate}%/g, data.operateType || "");
				row = row.replace(/\%{module}%/g, data.moduleName || "");
				row = row.replace(/\%{state}%/g, data.state || "");
				row = row.replace(/\%{visitTime}%/g, TDT.formatTime(data.visitTime));
				html.push(row);
			});
			list.html(html.join(""));
		}
	};
	LogFun.fn.init.prototype = LogFun.fn;
 })();