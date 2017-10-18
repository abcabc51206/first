$(document).ready(function(){
	var logFun = new LogFun();
    logFun.searchPass30LogFunForDetail();
});

function pieOpLog(){
	art.dialog({
	    title: '过去30天操作日志统计',
	    resize: false,
	    width : "800px",
		height : "460px",
	    content: '<iframe id="ifrService" width="800px" height="440px" src="operate-log-pie.html?tag=3"></iframe>',
	    cancelVal: "关闭",
	    cancel: function(){
	    	return true;
	    }
	});
	
}

function barOpLog(){
	art.dialog({
	    title: '过去30天操作日志统计',
	    resize: false,
	    width : "800px",
		height : "460px",
	    content: '<iframe id="ifrService" width="800px" height="440px" src="operate-log-bar.html?tag=3"></iframe>',
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