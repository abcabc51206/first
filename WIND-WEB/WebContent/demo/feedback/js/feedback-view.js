var feedback = new Feedback();

$(document).ready(function(){  
	var id = TDT.getParam("id");
    feedback.findById(id);
}); 

