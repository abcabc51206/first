$(document).ready(function(){
	$("#stDay").datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				dateFormat: "yy-mm-dd",
				monthNamesShort:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
				dayNamesMin:["日","一","二","三","四","五","六"]
			});
			
	var dateObj = new Date();
	var currDate = dateObj.getFullYear()+"-"+(dateObj.getMonth()+1)+"-"+dateObj.getDate();
	$("#stDay").val(currDate);
	var logFun = new LogFun();
    logFun.searchEveryDayLogFunForDetail(currDate);
	
});

function stDay(){
	var currDate = $("#stDay").val();
	var logFun = new LogFun();
    logFun.searchEveryDayLogFunForDetail(currDate);
}

function pieOpLog(){
	var currDate = $("#stDay").val();
	art.dialog({
	    title: '每日操作日志统计',
	    resize: false,
	    width : "800px",
		height : "460px",
	    content: '<iframe id="ifrService" width="800px" height="440px" src="operate-log-pie.html?tag=1&currDate='+currDate+'"></iframe>',
	    cancelVal: "关闭",
	    cancel: function(){
	    	return true;
	    }
	});
	
}

function barOpLog(){
	var currDate = $("#stDay").val();
	art.dialog({
	    title: '每日操作日志统计',
	    resize: false,
	    width : "800px",
		height : "460px",
	    content: '<iframe id="ifrService" width="800px" height="440px" src="operate-log-bar.html?tag=1&currDate='+currDate+'"></iframe>',
	    cancelVal: "关闭",
	    cancel: function(){
	    	return true;
	    }
	});
	
}

function changeSt(flag){
	if(flag == 1){
		TDT.go('operate-log-day.html');
	} else if(flag == 2){
		TDT.go('operate-log-month.html');
	} else if(flag == 3){
		TDT.go('operate-log-pass30.html');
	} else if(flag == 4){
		TDT.go('operate-log-year.html');
	}
}