$(document).ready(function(){
var date = new Date();
	var currYear = date.getFullYear();
	var jqSelObj = $("#stYear");
	for(var i=10; i >0; i--){
		jqSelObj.append($("<option value='"+(currYear-i)+"'>"+(currYear-i)+"</option>"));
	}
	
	for(var i=0; i <= 10; i++){
		jqSelObj.append($("<option value='"+(currYear+i)+"'>"+(currYear+i)+"</option>"));
	}	
	jqSelObj.val(currYear);		
	
	var currMonth = date.getMonth() + 1;
	$("#stMonth").val(currMonth)
	
	var logFun = new LogFun();
    logFun.searchEveryMonthLogFunForDetail(currYear+"-"+currMonth);
});

function stYearMonth(){
	var currYear = $("#stYear").val();
	var currMonth = $("#stMonth").val();
	var logFun = new LogFun();
    logFun.searchEveryMonthLogFunForDetail(currYear+"-"+currMonth);
}

function pieOpLog(){
	var currYear = $("#stYear").val();
	var currMonth = $("#stMonth").val();
	var currDate = currYear+"-"+currMonth;
	art.dialog({
	    title: '每月操作日志统计',
	    resize: false,
	    width : "800px",
		height : "460px",
	    content: '<iframe id="ifrService" width="800px" height="440px" src="operate-log-pie.html?tag=2&currDate='+currDate+'"></iframe>',
	    cancelVal: "关闭",
	    cancel: function(){
	    	return true;
	    }
	});
	
}

function barOpLog(){
	var currYear = $("#stYear").val();
	var currMonth = $("#stMonth").val();
	var currDate = currYear+"-"+currMonth;
	art.dialog({
	    title: '每月操作日志统计',
	    resize: false,
	    width : "800px",
		height : "460px",
	    content: '<iframe id="ifrService" width="800px" height="440px" src="operate-log-bar.html?tag=2&currDate='+currDate+'"></iframe>',
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