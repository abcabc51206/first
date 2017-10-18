var searchType = new SearchType();

$(document).ready(function(){
	searchType.getParentNode();
	
	//如果是从树中进入添加页面.自动填充 上级分类
 	var id = TDT.getParam("id");
 	var title = TDT.getParam("title");
 	if(id && title)
 		searchType.setTreenode(title,id);
});

function addresearch(){
	searchType.addSearchType();
}

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		searchType.updateFile(form);
	} else{
		searchType.uploadFile(form);
	}
}