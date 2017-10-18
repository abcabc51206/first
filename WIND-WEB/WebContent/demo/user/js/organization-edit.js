var org = new Organization();
$(document).ready(function(){
    var id = TDT.getParam("id");
    org.findOrganizationById(id,"edit");
    org.getOrgTreeForSel("parent-org", "org.parentOrg.orgId");
}); 

function saveOrganization(){
    org.updateOrganization();
}
