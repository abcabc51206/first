var links = new Links();
$(document).ready(function(){
    var id = TDT.getParam("id");
    $("#links-id").val(id);
    links.getLinksType();
    links.findLinksById(id);
}); 

function editLinks(){
    links.updateLinks();
}
