var perm = new Permissions();
$(document).ready(function(){
	perm.getPermTreeForSel();
	
	//如果是从树中进入添加页面.自动填充 上级分类
 	var id = TDT.getParam("id");
 	var title = TDT.getParam("title");
 	if(id && title)
 		perm.setTreeNode(title,id);
});

function addPerm(){
	perm.addPermissions();
}

