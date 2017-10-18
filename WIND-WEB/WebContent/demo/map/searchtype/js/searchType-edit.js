var searchType = new SearchType();

$(document).ready(function(){
	searchType.getParentNode();
	
	var id = TDT.getParam("id");
	searchType.findById(id,"edit");
});

function editSearchType(){
	searchType.updateSearchType();
}

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		searchType.updateFile(form);
	} else{
		searchType.uploadFile(form);
	}
}