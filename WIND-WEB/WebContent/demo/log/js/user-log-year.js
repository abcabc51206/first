$(document).ready(function(){
	$(".content").eq(0).show();
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
	
	var logUser = new LogUser();
    var data = logUser.searchEveryYearLogUser(currYear);
	createChart(currYear, data);
});

function createChart(currYear, data){
	var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'line',
                width:1024,
                height:342,//渲染div高度增加14,覆盖highcharts的links
                marginRight: 130,
		                marginBottom: 45,
                backgroundColor:null
            },
            title: {
                text: currYear+'年用户访问量统计',
                x: -20 //center
            },
            subtitle: {
                text: '总访问量：'+data.page.recordCount+'次',
                x: -20
            },
            xAxis: {
                categories: ['1月', '2月', '3月', '4月', '5月', '6月',
		                    '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: {
                title: {
                    text: '次数'
                },
                min: 0,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            tooltip: {
                formatter: function() {
                     return this.series.name +'：'+ this.y +'<br/>'+
		                        this.x;
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            credits: {
                enabled: false
            },
            series: data.series
        });
}

function logDetail(){
	var currDate = $("#stYear").val();
	art.dialog({
	    title: '每年用户访问统计',
	    resize: false,
	    width : "800px",
		height : "460px",
	    content: '<iframe id="ifrService" width="800px" height="440px" src="user-log-detail.html?tag=4&currDate='+currDate+'"></iframe>',
	    cancelVal: "关闭",
	    cancel: function(){
	    	return true;
	    }
	});
}

function stYear(){
	var currYear = $("#stYear").val();
	var logUser = new LogUser();
    var data = logUser.searchEveryYearLogUser(currYear);
    createChart(currYear, data);
}

function changeSt(flag){
	if(flag == 1){
		TDT.go('user-log-day.html');
	} else if(flag == 2){
		TDT.go('user-log-month.html');
	} else if(flag == 3){
		TDT.go('user-log-pass30.html');
	} else if(flag == 4){
		TDT.go('user-log-year.html');
	}
}