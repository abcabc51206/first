
$(document).ready(function(){  
    var id = TDT.getParam("id");
    var role = new Role();
    role.findRoleById(id, "view");
}); 