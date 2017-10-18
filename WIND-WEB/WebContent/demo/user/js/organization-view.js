
$(document).ready(function(){  
    var id = TDT.getParam("id");
    var org = new Organization();
    org.findOrganizationById(id,"view");
}); 