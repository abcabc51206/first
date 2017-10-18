$(document).ready(function(){  
    var id = TDT.getParam("id");
    var news = new News();
    news.findNewsById(id);
}); 