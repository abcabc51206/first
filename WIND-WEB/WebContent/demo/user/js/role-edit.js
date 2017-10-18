var role = new Role();
$(document).ready(function(){  
    var id = TDT.getParam("id");
    role.findRoleById(id, "edit");
}); 

function saveRole(){
    role.updateRole();
}
