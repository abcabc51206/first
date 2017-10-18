var cities = new Cities();

$(document).ready(function(){  
	cities.findLocalDistrict("","add");
}); 

function addCities(){
	cities.addCities();
}

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		cities.updateFile(form);
	} else{
		cities.uploadFile(form);
	}
}

function sarSelectChange(obj){
	if(obj[obj.selectedIndex].value == 0 ){
		$("#cities-title").val("");
	}
	else{
		$("#cities-title").val(obj[obj.selectedIndex].text);
	}
}
