var user = new User();
$(document).ready(function(){  
    var id = TDT.getParam("id");
    user.findUserById(id, "edit");
    $.datepicker.setDefaults( $.datepicker.regional[ "zh-CN" ] );
  	$("input.datefrom").datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		dateFormat: "yy-mm-dd",
		monthNamesShort:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
		dayNamesMin:["日","一","二","三","四","五","六"],
		onSelect: function( selectedDate ) {
			$( "input.dateto" ).datepicker( "option", "minDate", selectedDate );
		}
	});
	$("input.dateto").datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		dateFormat: "yy-mm-dd",
		monthNamesShort:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
		dayNamesMin:["日","一","二","三","四","五","六"],
		onSelect: function( selectedDate ) {
			$( "input.datefrom" ).datepicker( "option", "maxDate", selectedDate );
		}
	});
}); 

 

function saveUser(){
    user.updateUser();
}

function modifyPwd(){
	user.modifyPwd();
}
