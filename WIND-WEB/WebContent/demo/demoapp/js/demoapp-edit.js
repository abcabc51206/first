var demoApp = new DemoApp();
$(document).ready(function(){  
    var id = TDT.getParam("id");
    $("#demoapp-id").val(id);
    demoApp.findDemoAppById(id);
}); 

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		demoApp.updateFile(form);
	} else{
		demoApp.uploadFile(form);
	}
}

function editDemoApp(){
    demoApp.updateDemoApp();
}
