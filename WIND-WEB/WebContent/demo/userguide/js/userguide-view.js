$(document).ready(function(){  
    var id = TDT.getParam("id");
    var userguide = new Userguide();
    userguide.findUserguideById(id);
}); 