$(document).ready(function(){
	var logFun = new LogFun();
	var tag = TDT.getParam("tag");
	var currDate = TDT.getParam("currDate");
	var data;
	var dateTitle;
	if(tag == 1){
		data = logFun.searchEveryDayLogFun(currDate);
		dateTitle = currDate;
	} else if(tag == 2){
		data = logFun.searchEveryMonthLogFun(currDate);
		dateTitle = currDate.split("-")[0]+"年"+currDate.split("-")[1]+"月"
	} else if(tag == 3){
	    data = logFun.searchPass30LogFun();
	    dateTitle = "过去30天";
	} else if(tag == 4){
		data = logFun.searchEveryYearLogFun(currDate);
		dateTitle = currDate+"年";
	} 
	createBarForOperateLog(dateTitle, data);
});


function createBarForOperateLog(dateTitle, data){
	var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'bar'
            },
            title: {
                text: dateTitle+'操作日志访问统计',
                x: -20 //center
            },
            subtitle: {
                text: '总访问量：'+data.page.recordCount+'次',
                x: -20
            },
            xAxis: data.barChart.xAxis,
            yAxis: {
                min: 0,
                title: {
                    text: '次数',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                formatter: function() {
                    return ''+
                        this.series.name +': '+ this.y +' 次';
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -100,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: data.barChart.series
        });
}