/**
 * 用户访问日志模块对象
 * @author wangshoudong
 * @version 1.0 2012/10/18
 */
 
 (function(){
var LogUser = window.LogUser = function(){
		return new LogUser.fn.init();
	};
	
	LogUser.url = {
		searchPass30LogUser : "log/searchPass30LogUser.do",
		searchEveryYearLogUser : "log/searchEveryYearLogUser.do",
		searchEveryMonthLogUser : "log/searchEveryMonthLogUser.do",
		searchEveryDayLogUser : "log/searchEveryDayLogUser.do"
	};
	
	//初始当前页
	LogUser.pageNum = 1;
	
	//当前页记录条数
	LogUser.pageSize = 10;
	
	LogUser.fn = LogUser.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		
		/**
		 * 统计过去30天用户访问量
		 */
		searchPass30LogUser : function(){
			var url = LogUser.url["searchPass30LogUser"];
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
		searchPass30LogUserForDetail : function(){
			var url = LogUser.url["searchPass30LogUser"];
			var params = "pageNum="+LogUser.pageNum+"&pageSize="+LogUser.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					var data = json.result;
					if(data.logUserList.length>0){
						LogUser.fn.bindLogUserList(data.logUserList,"logUser");
						var pagerObj = document.getElementById("pager");
						TDT.pager(LogUser.pageNum, LogUser.pageSize, data.page.recordCount, pagerObj, function(p){
							LogUser.pageNum = p;
							LogUser.fn.searchPass30LogUserForDetail();
						});
						$("#noData").hide();
					} else{
						$("#logUserList").html("");
						$("#noData").show();		
						$("#pager").html("");
					}
				}else {
					$("#logUserList").html("发生异常，请联系管理员！");
					$("#pager").html("");
				}
			});
		},
		
		/**
		 * 统计每年用户访问量
		 */
		searchEveryYearLogUser : function(currYear){
			var url = LogUser.url["searchEveryYearLogUser"];
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
		searchEveryYearLogUserForDetail : function(currYear){
			var url = LogUser.url["searchEveryYearLogUser"];
			var params = "pageNum="+LogUser.pageNum+"&pageSize="+LogUser.pageSize+"&currDate="+currYear;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					var data = json.result;
					if(data.logUserList.length>0){
						LogUser.fn.bindLogUserList(data.logUserList,"logUser");
						var pagerObj = document.getElementById("pager");
						TDT.pager(LogUser.pageNum, LogUser.pageSize, data.page.recordCount, pagerObj, function(p){
							LogUser.pageNum = p;
							LogUser.fn.searchEveryYearLogUserForDetail(currYear);
						});
						$("#noData").hide();
					} else{
						$("#logUserList").html("");
						$("#noData").show();		
						$("#pager").html("");
					}
				}
			});
		},
		
		/**
		 * 统计每月用户访问量
		 */
		searchEveryMonthLogUser : function(currYearMonth){
			var url = LogUser.url["searchEveryMonthLogUser"];
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
		searchEveryMonthLogUserForDetail : function(currYearMonth){
			var url = LogUser.url["searchEveryMonthLogUser"];
			var params = "pageNum="+LogUser.pageNum+"&pageSize="+LogUser.pageSize+"&currDate="+currYearMonth;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					var data = json.result;
					if(data.logUserList.length>0){
						LogUser.fn.bindLogUserList(data.logUserList,"logUser");
						var pagerObj = document.getElementById("pager");
						TDT.pager(LogUser.pageNum, LogUser.pageSize, data.page.recordCount, pagerObj, function(p){
							LogUser.pageNum = p;
							LogUser.fn.searchEveryMonthLogUserForDetail(currYearMonth);
						});
						$("#noData").hide();
					} else{
						$("#logUserList").html("");
						$("#noData").show();		
						$("#pager").html("");
					}
				}
			});
		},
		
		/**
		 * 统计每日用户访问量
		 */
		searchEveryDayLogUser : function(currDate){
			var url = LogUser.url["searchEveryDayLogUser"];
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
		searchEveryDayLogUserForDetail : function(currDate){
			var url = LogUser.url["searchEveryDayLogUser"];
			var params = "pageNum="+LogUser.pageNum+"&pageSize="+LogUser.pageSize+"&currDate="+currDate;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					var data = json.result;
					if(data.logUserList.length>0){
						LogUser.fn.bindLogUserList(data.logUserList,"logUser");
						var pagerObj = document.getElementById("pager");
						TDT.pager(LogUser.pageNum, LogUser.pageSize, data.page.recordCount, pagerObj, function(p){
							LogUser.pageNum = p;
							LogUser.fn.searchEveryDayLogUserForDetail(currDate);
						});
						$("#noData").hide();
					} else{
						$("#logUserList").html("");
						$("#noData").show();		
						$("#pager").html("");
					}
				}
			});
		},
		
		/*
		 * 绑定 通用配置数据列表
		 */
		bindLogUserList : function(json, key){
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
				row = row.replace(/\%{state}%/g, data.state || "");
				row = row.replace(/\%{visitTime}%/g, TDT.formatTime(data.visitTime));
				html.push(row);
			});
			list.html(html.join(""));
		}
	};
	LogUser.fn.init.prototype = LogUser.fn;
 })();