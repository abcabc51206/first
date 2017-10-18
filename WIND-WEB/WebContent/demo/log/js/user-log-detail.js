$(document).ready(function(){
	var logUser = new LogUser();
	var tag = TDT.getParam("tag");
	var currDate = TDT.getParam("currDate");
	if(tag == 1){
		logUser.searchEveryDayLogUserForDetail(currDate);
	} else if(tag == 2){
		logUser.searchEveryMonthLogUserForDetail(currDate);
	} else if(tag == 3){
	    logUser.searchPass30LogUserForDetail();
	} else if(tag == 4){
		logUser.searchEveryYearLogUserForDetail(currDate);
	} 
});
