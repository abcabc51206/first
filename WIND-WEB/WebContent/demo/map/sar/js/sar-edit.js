 var sar = new Sar();
 
$(document).ready(function(){
 	sar.getParentNode();
 		
 	var id = TDT.getParam("id");
 	sar.findById(id,"edit");
 });

 
function editsar(){
	sar.updateSar();
}