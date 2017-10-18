$(document).ready(function(){
	$(".content").eq(0).show();
	
	
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
	var logUser = new LogUser();
    var data = logUser.searchEveryDayLogUser(currDate);
	
	createChart(currDate, data);
});

function createChart(currDate, data){
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
                text: currDate+'用户访问量统计',
                x: -20 //center
            },
            subtitle: {
                text: '总访问量：'+data.page.recordCount+'次',
                x: -20
            },
            xAxis: {
                categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
		                				'13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
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
	var currDate = $("#stDay").val();
	art.dialog({
	    title: '每日用户访问统计',
	    resize: false,
	    width : "800px",
		height : "460px",
	    content: '<iframe id="ifrService" width="800px" height="440px" src="user-log-detail.html?tag=1&currDate='+currDate+'"></iframe>',
	    cancelVal: "关闭",
	    cancel: function(){
	    	return true;
	    }
	});
}
	

function stDay(){
	var logUser = new LogUser();
	var currDate = $("#stDay").val();
    var data = logUser.searchEveryDayLogUser(currDate);
	createChart(currDate, data);
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