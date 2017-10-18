
$(document).ready(function(){  
    var id = TDT.getParam("id");
    var perm = new Permissions();
    perm.findPermissionsById(id, "view");
}); 