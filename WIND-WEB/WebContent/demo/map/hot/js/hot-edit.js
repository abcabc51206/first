 var hot = new Hot();

 $(document).ready(function(){
 	hot.getTreeNode();
 	
 	var id = TDT.getParam("id");
 	hot.findById(id,"edit");
 });
 
 function editHot(){
 	hot.updateHot();
 }
 
  function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		hot.updateFile(form);
	} else{
		hot.uploadFile(form);
	}
}