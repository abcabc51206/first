var userguide = new Userguide();
$(document).ready(function(){  
    Userguide.editor = CKEDITOR.replace( 'userguide-content' );
	userguide.getUserguideType();    
}); 

function addUserguide(){
	var userguideHtml = Userguide.editor.getData();
	$("#userguide-content").val(userguideHtml);
	userguide.addUserguide();
}

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		userguide.updateFile(form);
	} else{
		userguide.uploadFile(form);
	}
}

