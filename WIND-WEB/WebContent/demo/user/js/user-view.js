
$(document).ready(function(){  
    var id = TDT.getParam("id");
    var user = new User();
    user.findUserById(id, "view");
}); 