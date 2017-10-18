var org = new Organization();
$(document).ready(function(){
	org.getOrgTreeForSel("parent-org", "org.parentOrg.orgId");
	
	//如果是从树中进入添加页面.自动填充 上级分类
 	var id = TDT.getParam("id");
 	var title = TDT.getParam("title");
 	if(id && title)
 		org.setTreeNode(title,id);
});

function addOrg(){
	org.addOrganization();
}



