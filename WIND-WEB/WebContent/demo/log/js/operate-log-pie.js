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
	createPieForOperateLog(dateTitle, data);
});


function createPieForOperateLog(dateTitle, data){
	var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: dateTitle+'操作日志访问统计',
                x: -20 //center
            },
            subtitle: {
                text: '总访问量：'+data.page.recordCount+'次',
                x: -20
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            	percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>= '+(((this.percentage/100)*data.page.recordCount).toFixed(0))+'次('+ this.percentage.toFixed(1) +' %)';
                        }
                    },
                    showInLegend: true
                }
            },
            credits: {
                enabled: false
            },
            series: data.pieSeries
        });
}