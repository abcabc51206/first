var standards = new Standards();
$(document).ready(function(){
    var id = TDT.getParam("id");
    $("#standards-id").val(id);
    standards.findStandardsById(id);
    standards.getStandardsDocType();
    $.datepicker.setDefaults( $.datepicker.regional[ "zh-CN" ] );
  	$("#standards-year").datepicker({
		defaultDate: "+1w",
		changeYear: true,
		dateFormat: "yy",
		monthNamesShort:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
		dayNamesMin:["日","一","二","三","四","五","六"]
	});
}); 

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		standards.updateFile(form);
	} else{
		standards.uploadFile(form);
	}
}

function editStandards(){
    standards.updateStandards();
}
