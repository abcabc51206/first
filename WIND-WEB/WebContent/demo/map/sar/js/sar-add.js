 var sar = new Sar();

 $(document).ready(function(){
 	sar.getParentNode();
 	
 	//如果是从树中进入添加页面.自动填充 上级行政区
 	var id = TDT.getParam("id");
 	var title = TDT.getParam("title");
 	if(id && title)
 		sar.setTreenode(title,id);
 });
 
 function addSarForm(){
 	sar.addSar();
 }
 