var userguide = new Userguide();
$(document).ready(function(){
	Userguide.editor = CKEDITOR.replace( 'userguide-content' );  
    var id = TDT.getParam("id");
    $("#userguide-id").val(id);
    userguide.findUserguideById(id);
    userguide.getUserguideType();
}); 

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		userguide.updateFile(form);
	} else{
		userguide.uploadFile(form);
	}
}

function editUserguide(){
	var userguideHtml = Userguide.editor.getData();
	$("#userguide-content").val(userguideHtml);
    userguide.updateUserguide();
}
