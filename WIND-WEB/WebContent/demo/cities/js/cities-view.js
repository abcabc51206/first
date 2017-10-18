$(document).ready(function(){  
    var id = TDT.getParam("id");
    var cities = new Cities();
    cities.findCitiesById(id,"view");
}); 