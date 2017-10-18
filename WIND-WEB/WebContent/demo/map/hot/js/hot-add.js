 var hot = new Hot();

 $(document).ready(function(){
 	hot.getTreeNode();
 });
 
 function addhot(){
 	hot.saveHot();
 }
 
 function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		hot.updateFile(form);
	} else{
		hot.uploadFile(form);
	}
}