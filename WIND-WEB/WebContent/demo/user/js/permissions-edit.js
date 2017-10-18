var perm = new Permissions();
$(document).ready(function(){  
	perm.getPermTreeForSel();
    var id = TDT.getParam("id");
    perm.findPermissionsById(id, "edit");
}); 

 

function savePerm(){
    perm.updatePermissions();
}
