$(document).ready(function(){
	$(".content").eq(0).show();
	var logUser = new LogUser();
	var data = logUser.searchPass30LogUser();
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
                text: '过去30天用户访问量统计',
                x: -20 //center
            },
            subtitle: {
                text: '总访问量：'+data.page.recordCount+'次',
                x: -20
            },
            xAxis: {
                categories: data.xAxis.categories
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
        
});

function logDetail(){
	art.dialog({
	    title: '过去30天用户访问统计',
	    resize: false,
	    width : "800px",
		height : "430px",
	    content: '<iframe id="ifrService" width="800px" height="440px" src="user-log-detail.html?tag=3"></iframe>',
	    cancelVal: "关闭",
	    cancel: function(){
	    	return true;
	    }
	});
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