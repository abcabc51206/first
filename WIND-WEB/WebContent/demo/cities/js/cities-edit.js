var cities = new Cities();
$(document).ready(function(){  
    var id = TDT.getParam("id");
    $("#cities-id").val(id);
    cities.findCitiesById(id,"edit");
}); 

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		cities.updateFile(form);
	} else{
		cities.uploadFile(form);
	}
}

function editCities(){
    cities.updateCities();
}
