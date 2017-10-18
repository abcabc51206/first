var demoApp = new DemoApp();

function addDemoApp(){
	demoApp.addDemoApp();
}

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		demoApp.updateFile(form);
	} else{
		demoApp.uploadFile(form);
	}
}

